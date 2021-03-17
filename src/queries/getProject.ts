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
  ownerLogin: string,
  options: IGetProjectOptions
): string {
  let projectConditions: string = ''
  options = Object.assign({}, defaultOptions, options)

  if (options.projectId !== undefined) {
    projectConditions = `project(number: ${options.projectId}) {
      id
      name
      ${getPartials<IGetProjectOptions>(options, getProjectPartials, 1)}
    }`
  } else if (options.projectName !== undefined) {
    projectConditions = `projects(search: "${options.projectName}", first: 1) {
      edges {
        node {
          id
          name
          ${getPartials<IGetProjectOptions>(options, getProjectPartials, 1)}
        }
      }
    }`
  }

  return `${options.ownerType as string}(login: "${ownerLogin}") {
    ${projectConditions}
  }`
}

const getProjectPartials = {
  columns (options: IGetProjectOptions) {
    return `columns(first: ${options.columnLimit as number}) {
      edges {
        node {
          id
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
          id
          content {
            ${options.cardTypes === undefined
              ? ''
              : options.cardTypes.map(cardType => `...on ${cardType} {
              __typename
              id
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
          id
        }
      }
    }`
  }
}
