import * as core from '@actions/core'
import Services from './Services'
import { get, map } from './utils'

declare const NODE_ENV: string

interface IRunOptions {
  token: string
  repository: string
  projectSearch: string
}
async function run ({
  token,
  repository,
  projectSearch
}: IRunOptions): Promise<void> {
  const services = new Services(token)

  const repo = await services.getRepo(repository)
  const project = await services.getProject('tekuasia', repo.ownerType,
    /^\d+$/.test(projectSearch) ? parseInt(projectSearch) : projectSearch
  )

  if (repo.id === undefined) {
    core.warning(`No repo found as '${repository}'`)
    return
  }

  if (project.id === undefined) {
    core.warning(`No project found with provided search '${projectSearch}'`)
    return
  }

  console.log(repo.labels)
}

function getInputs (): IRunOptions {
  if (NODE_ENV === 'production') {
    return {
      token: core.getInput('ACTION_TOKEN'),
      projectSearch: core.getInput('PROJECT_SEARCH'),
      repository: core.getInput('REPOSITORY')
    }
  } else {
    return {
      token: get(process.argv, 2),
      projectSearch: get(process.argv, 3),
      repository: get(process.argv, 4)
    }
  }
}

run(getInputs()).catch((err: Error) => core.setFailed(err.stack ?? err.message))
