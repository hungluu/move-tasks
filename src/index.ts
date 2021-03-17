import * as core from '@actions/core'
import * as github from '@actions/github'
import getProject from './queries/getProject'
import getRepo from './queries/getRepo'
import Services from './services'
import { query } from './utils'

async function run (): Promise<void> {
  const token = '79581bf40a8c2a2422a0ab0a58dc56861b9cbee5' // core.getInput('ACTION_TOKEN')
  const projectId = 5 // parseInt(core.getInput('PROJECT_ID'))

  core.info(`Action running for project #${projectId}`)

  // const { repo: { repo } } = github.context

  const services = new Services(token)

  const repo = await services.getRepo('tekuasia/blocks')
  const project = await services.getProject('tekuasia', repo.ownerType, 5)

  console.log(project)
}

run().catch((err: Error) => core.setFailed(err.stack ?? err.message))
