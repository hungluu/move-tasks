import { getPartials } from '../utils'
export type OwnerType = 'organization' | 'user'
export type CardType = 'Issue' | 'PullRequest'

interface IGetProjectOptions {
  partials?: string[]
  ownerType: OwnerType
  projectName?: string
  projectId?: number
  columnLimit?: number
  cardLimit?: number
  cardLabelLimit?: number
  cardTypes?: CardType[]
}

const defaultOptions = {
  cardLimit: 50,
  columnLimit: 30,
  cardLabelLimit: 20,
  cardTypes: [
    'Issue',
    'PullRequest'
  ]
}

export default function (
  ownerOrRepo: string,
  options: IGetProjectOptions
): string {
  let projectConditions = ''

  options = Object.assign({}, defaultOptions, options)

  if (options.projectId !== undefined) {
    projectConditions = `project(number: ${options.projectId}) {
      number
      databaseId
      name
      ${getPartials<IGetProjectOptions>(options, getProjectPartials, 1)}
    }`
  } else if (options.projectName !== undefined) {
    projectConditions = `projects(search: "${options.projectName}", first: 1) {
      edges {
        node {
          number
          databaseId
          name
          ${getPartials<IGetProjectOptions>(options, getProjectPartials, 1)}
        }
      }
    }`
  }

  const [owner, repo] = ownerOrRepo.split('/')

  if (repo !== undefined) {
    return `${options.ownerType as string}(login: "${owner}") {
      repository(name: "${repo}") {
        ${projectConditions}
      }
    }`
  } else {
    return `${options.ownerType as string}(login: "${owner}") {
      ${projectConditions}
    }`
  }
}

const getProjectPartials = {
  columns (options: IGetProjectOptions) {
    return `columns(first: ${options.columnLimit as number}) {
      edges {
        node {
          databaseId
          name
          ${getPartials<IGetProjectOptions>(options, getProjectPartials, 2)}
        }
      }
    }`
  },
  'column.cards' (options: IGetProjectOptions) {
    return `cards(first: ${options.cardLimit as number}) {
      edges {
        node {
          databaseId
          content {
            ${options.cardTypes === undefined
              ? ''
              : options.cardTypes.map(cardType => `...on ${cardType} {
              __typename
              number
              title
              databaseId
              createdAt
              author {
                login
              }
              state
              assignees(first: 10) {
                edges {
                  node {
                    databaseId
                    login
                  }
                }
              }
              ${getPartials<IGetProjectOptions>(options, getProjectPartials, 3)}
            }`).join('\n')}
          }
        }
      }
    }`
  },
  'column.card.labels' (options: IGetProjectOptions) {
    return `labels(first: ${options.cardLabelLimit as number}) {
      edges {
        node {
          resourcePath
          name
        }
      }
    }`
  }
}
