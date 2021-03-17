import * as github from '@actions/github'
import getProject from './queries/getProject'
import type { OwnerType } from './queries/getProject'
import getRepo from './queries/getRepo'
import { IProject, IRepo, project, repo } from './types'
import { query } from './utils'

export default class Services {
  private readonly client

  constructor (token: string) {
    this.client = github.getOctokit(token)
  }

  async getRepo (ownerRepo: string): Promise<IRepo> {
    return repo(await this.client.graphql(query(getRepo(ownerRepo, {
      partials: ['labels']
    }))))
  }

  async getProject (ownerLogin: string, ownerType: string, search: string | number): Promise<IProject> {
    const options: any = {
      ownerType: (ownerType as OwnerType),
      partials: [
        'columns',
        'column.cards',
        'column.card.labels'
      ]
    }

    if (typeof search === 'string') {
      options.projectName = search
    } else {
      options.projectId = search
    }

    return project(await this.client.graphql(query(getProject(ownerLogin, options))))
  }
}
