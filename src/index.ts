import * as core from '@actions/core'
import Instructor from './Instructor'
import Services from './Services'
import { get, map } from './utils'

declare const NODE_ENV: string

interface IRunOptions {
  token: string
  repository: string
  projectSearch: string
  from: string
  to: string
}
async function run ({
  token,
  repository,
  projectSearch
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
    project
  })

  console.log(instructor.get('project.columns(name is In progress).cards(contentLabels has test)'))
}

function getInputs (): IRunOptions {
  if (NODE_ENV === 'production') {
    return {
      token: core.getInput('ACTION_TOKEN'),
      projectSearch: core.getInput('PROJECT_SEARCH'),
      repository: core.getInput('REPOSITORY'),
      from: core.getInput('FROM'),
      to: core.getInput('TO')
    }
  } else {
    return {
      token: get(process.argv, 2),
      projectSearch: get(process.argv, 3).trim(),
      repository: get(process.argv, 4),
      from: 'project.columns(name in ).card(contentLabels has )',
      to: 'first project.columns(name.is())'
    }
  }
}

run(getInputs()).catch((err: Error) => core.setFailed(err.stack ?? err.message))
