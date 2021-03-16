import * as core from '@actions/core'
import * as github from '@actions/github'

async function run (): Promise<void> {
  const token = core.getInput('ACTION_TOKEN')
  const projectId = parseInt(core.getInput('PROJECT_ID'))

  core.info(`Action running for project #${projectId}`)

  const octokit = github.getOctokit(token)

  core.info('Got octokit')

  const project = await octokit.projects.listColumns({
    project_id: projectId
  })

  core.info('Got project')

  console.log(project.data)
}

run().catch((err: Error) => core.setFailed(err.stack ?? err.message))
