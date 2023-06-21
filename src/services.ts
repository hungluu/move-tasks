import * as github from '@actions/github'
import getProject from './queries/getProject'
import type { OwnerType } from './queries/getProject'
import getRepo from './queries/getRepo'
import { type IProject, type IRepo, project, repo } from './types'
import { query } from './utils'

export default class Services {
  private readonly client

  constructor (token: string) {
    this.client = github.getOctokit(token)
  }

  async getRepo (ownerRepo: string): Promise<IRepo> {
    return repo(await this.client.graphql(query(getRepo(ownerRepo))))
  }

  async getProject (ownerOrRepo: string, ownerType: string, search: string | number): Promise<IProject> {
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

    return project(await this.client.graphql(query(getProject(ownerOrRepo, options))))
  }

  async addCardToColumn (columnId: string, cardId: string): Promise<any> {
    return await this.client.rest.projects.moveCard({
      card_id: parseInt(cardId),
      column_id: parseInt(columnId),
      position: 'top'
    })
  }
}
