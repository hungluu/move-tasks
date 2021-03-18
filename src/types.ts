import { get, map, zipObject } from './utils'

export interface IRepo {
  id: string
  name: string
  // ownerId: string
  ownerType: string
  // labels: {[key: string]: string} // id: name
}
export function repo (data: any): IRepo {
  const root = get(data, 'repositoryOwner', {})
  const repository = get(root, 'repository', {})
  // const labels = map(get(repository, 'labels.edges'), 'node')

  return {
    id: get(repository, 'databaseId'),
    name: get(repository, 'name'),
    // ownerId: get(root, 'databaseId'),
    ownerType: (get(root, '__typename') as string).toLowerCase()
    // labels: zipObject(
    //   map(labels, 'id'),
    //   map(labels, 'name')
    // )
  }
}

export interface IProjectCard {
  id: string
  contentId: string
  contentTitle: string
  contentType: string
  contentCreatedAt: string
  contentAuthor: string
  contentState: string
  // { assigneeId: assigneeName }
  contentAssignees: {[key: string]: string}
  // { labelId: labelName }
  contentLabels: {[key: string]: string}
}
export interface IProjectColumn {
  id: string
  name: string
  cards: IProjectCard[]
}
export interface IProject {
  id: string
  name: string
  columns: IProjectColumn[]
}
export function project (data: any): IProject {
  const root = get(data, 'organization', get(data, 'user', {}))
  const repo = get(root, 'repository', root)
  const project = get(repo, 'projects.edges.0.node', get(repo, 'project', {}))
  const columns = map(get(project, 'columns.edges'), 'node')

  return {
    id: get(project, 'databaseId'),
    name: get(project, 'name'),
    columns: map(columns, column => {
      const cards = map(get(column, 'cards.edges'), 'node')

      return {
        id: get(column, 'databaseId'),
        name: get(column, 'name'),
        cards: map(cards, card => {
          const content = get(card, 'content', {})
          const labels = map(get(content, 'labels.edges'), 'node')
          const assignees = map(get(content, 'assignees.edges'), 'node')

          return {
            id: get(card, 'databaseId'),
            contentId: get(content, 'databaseId'),
            contentTitle: get(content, 'title'),
            contentType: get(content, '__typename'),
            contentCreatedAt: get(content, 'createdAt'),
            contentAuthor: get(content, 'author.login'),
            contentState: (get(content, 'state') as string + '').toLowerCase(),
            contentAssignees: zipObject(
              map(assignees, 'databaseId'),
              map(assignees, 'login')
            ),
            contentLabels: zipObject(
              map(labels, 'resourcePath'),
              map(labels, 'name')
            )
          }
        })
      }
    })
  }
}
