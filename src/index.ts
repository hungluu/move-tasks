import * as core from '@actions/core'
import * as github from '@actions/github'
import Instructor from './Instructor'
import Services from './Services'
import { get } from './utils'

declare const NODE_ENV: string

interface IRunOptions {
  token: string
  repository: string
  projectSearch: string
  fromCards: string
  toColumn: string
}
async function run ({
  token,
  repository,
  projectSearch,
  fromCards,
  toColumn
}: IRunOptions): Promise<void> {
  const services = new Services(token)

  const repo = await services.getRepo(repository)
  const project = await services.getProject(repository, repo.ownerType,
    /^\d+$/.test(projectSearch) ? parseInt(projectSearch) : projectSearch
  )

  if (repo.id === undefined) {
    throw Error(`No repo found as '${repository}'`)
  }

  if (project.id === undefined) {
    throw Error(`No project found with provided search '${projectSearch}'`)
  }

  const instructor = new Instructor({
    project,
    github
  })

  console.log(instructor.get(fromCards))
  console.log(instructor.get(toColumn))
}

function getInputs (): IRunOptions {
  if (NODE_ENV === 'production') {
    return {
      token: core.getInput('ACTION_TOKEN'),
      projectSearch: core.getInput('PROJECT_SEARCH'),
      repository: core.getInput('REPOSITORY'),
      fromCards: core.getInput('FROM_CARDS'),
      toColumn: core.getInput('TO_COLUMN')
    }
  } else {
    return {
      token: get(process.argv, 2),
      projectSearch: get(process.argv, 3).trim(),
      repository: get(process.argv, 4),
      fromCards: '$project > columns(name is In progress) > cards',
      toColumn: '$project > columns(name is Done)'
    }
  }
}

run(getInputs()).catch((err: Error) => core.setFailed(err.stack ?? err.message))
