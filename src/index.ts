import * as core from '@actions/core'
import Services from './Services'
import { get, getInputs, map } from './utils'

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

  console.log(map(project.columns, 'cards').map(cards => map(cards, 'contentLabels')))
}

run(getInputs<IRunOptions>({
  token: 'ACTION_TOKEN',
  projectSearch: 'PROJECT_SEARCH',
  repository: 'REPOSITORY'
}, {
  token: get(process.argv, 2),
  projectSearch: get(process.argv, 3),
  repository: 'tekuasia/blocks'
})).catch((err: Error) => core.setFailed(err.stack ?? err.message))
