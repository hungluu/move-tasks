import { get, map, zipObject } from 'lodash'

export interface IRepo {
  id: string
  name: string
  ownerId: string
  ownerType: string
  labels: {[key: string]: string} // id: name
}
export function repo (data: any): IRepo {
  const root = get(data, 'repositoryOwner', {})
  const repository = get(root, 'repository', {})
  const labels = map(get(repository, 'labels.edges', []), 'node')

  return {
    id: get(repository, 'id'),
    name: get(repository, 'name'),
    ownerId: get(root, 'id'),
    ownerType: (get(root, '__typename') as string).toLowerCase(),
    labels: zipObject(
      map(labels, 'id'),
      map(labels, 'name')
    )
  }
}

export interface IProject {
  id: string
  name: string
}
export function project (data: any): IProject {
  const root = get(data, 'organization', get(data, 'user', {}))
  const project = get(root, 'projects.edges.0.node', get(root, 'project', {}))

  return {
    id: get(project, 'id'),
    name: get(project, 'name')
  }
}
