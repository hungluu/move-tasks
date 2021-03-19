import * as core from '@actions/core'
import * as github from '@actions/github'
import Instructor from './Instructor'
import Services from './Services'
import type { IProjectCard, IProjectColumn } from './types'
import { get, map } from './utils'

declare const NODE_ENV: string

interface IRunOptions {
  token: string
  repository: string
  project: string
  fromCards: string
  toColumn: string
}
async function run ({
  token,
  repository,
  project,
  fromCards,
  toColumn
}: IRunOptions): Promise<any> {
  const services = new Services(token)

  const [owner] = repository.split('/')

  let projectSearch = project
  let ownerOrOwnRepo = owner

  if (project.includes('/')) {
    const projectSearchParts = project.split('/')

    projectSearch = projectSearchParts.pop() as string
    ownerOrOwnRepo = projectSearchParts.join('/')
  }

  const repo = await services.getRepo(repository)
  const proj = await services.getProject(
    ownerOrOwnRepo,
    repo.ownerType,
    /^\d+$/.test(projectSearch) ? parseInt(projectSearch) : projectSearch
  )

  if (repo.id === undefined) {
    throw Error(`No repo found as '${repository}'`)
  }

  if (proj.id === undefined) {
    throw Error(`No project found with provided search '${projectSearch}'`)
  }

  const instructor = new Instructor({
    project: proj,
    context: github.context ?? {}
  })

  const columns = instructor.get<IProjectColumn>(toColumn)

  if (columns.length === 0) {
    throw Error(`No column found with '${toColumn}'`)
  }

  const destColumn = get(columns, 0)
  const movingCards = instructor.get<IProjectCard>(fromCards)

  if (movingCards.length === 0) {
    core.warning(`No cards found with '${fromCards}'`)
  }

  const movedCards: {[key: string]: string} = {}
  const cardErrors: {[key: string]: string} = {}
  await Promise.all(movingCards.map(async card => {
    try {
      await services.addCardToColumn(destColumn.id.toString(), card.id.toString())

      movedCards[card.id] = card.contentTitle
    } catch (err) {
      cardErrors[card.id] = err.message
    }
  }))

  if (Object.keys(movedCards).length > 0) {
    core.info([
      'Moved cards: ',
      ...map(movedCards, (title, id) => `  - #${id}: ${title ?? '<note>'}`)
    ].join('\n'))
  }

  if (Object.keys(cardErrors).length > 0) {
    core.warning([
      'Errors during moving cards: ',
      ...map(cardErrors, (errorMessage, id) => `  - #${id}: ${errorMessage}`)
    ].join('\n'))
  }
}

function getInputs (): IRunOptions {
  if (NODE_ENV === 'production') {
    return {
      token: core.getInput('actionToken'),
      project: core.getInput('project'),
      repository: core.getInput('repository'),
      fromCards: core.getInput('fromCards'),
      toColumn: core.getInput('toColumn')
    }
  } else {
    return {
      token: get(process.argv, 2),
      project: get(process.argv, 3).trim(),
      repository: get(process.argv, 4),
      fromCards: '$project > columns(name is In progress) > cards',
      toColumn: '$project > columns(name is Done)'
    }
  }
}

run(getInputs()).catch((err: Error) => core.setFailed(err.stack ?? err.message))
