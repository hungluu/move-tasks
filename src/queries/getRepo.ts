import { getPartials } from '../utils'

interface IGetRepoOptions {
  partials?: string[]
  labelLimit?: number
}

const defaultOptions = {
  labelLimit: 50
}

export default function (
  repo: string,
  options: IGetRepoOptions = defaultOptions): string {
  options = Object.assign({}, defaultOptions, options)
  const [ownerLogin, repoName] = repo.split('/')

  return `repositoryOwner(login: "${ownerLogin}") {
    id
    __typename
    repository(name: "${repoName}") {
      id
      name
      ${getPartials<IGetRepoOptions>(options, getRepoPartials)}
    }
  }`
}

const getRepoPartials = {
  labels (options: IGetRepoOptions) {
    return `labels(first: ${options.labelLimit as number}) {
      edges {
        node {
          id
          name
        }
      }
    }`
  }
}
