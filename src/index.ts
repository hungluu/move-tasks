import * as core from '@actions/core'
import * as github from '@actions/github'

async function run (): Promise<void> {
  const token = core.getInput('ACTION_TOKEN')
  const projectId = parseInt(core.getInput('PROJECT_ID'))

  const octokit = github.getOctokit(token)

  const project = await octokit.projects.listColumns({
    project_id: projectId
  })

  console.log(project.data)
}

run().catch(error => core.setFailed(error.message))
