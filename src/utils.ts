import { pickBy } from 'lodash-es'

export function query (contents: string): string {
  return `query{${contents}}`
}

interface IWithPartials { partials?: string[] }
export type QueryPartial<T extends IWithPartials> = (options: T) => string
export interface INamedQueryPartials<T extends IWithPartials> {
  [key: string]: QueryPartial<T>
}
export const PARTIAL_SEPARATOR = '.'
export function getPartials<T extends IWithPartials> (
  options: T,
  namedPartials: INamedQueryPartials<T>,
  level: number = 0
): string {
  if (options.partials === undefined) {
    return ''
  } else {
    const selectedPartialNames = options.partials
    const selectedPartials = pickBy(namedPartials, (_, name) => {
      return selectedPartialNames.includes(name) &&
        // Allow all levels if selected level is 0
        (level < 1 || level === name.split(PARTIAL_SEPARATOR).length)
    })

    return Object.values(selectedPartials)
      .map(partialFn => partialFn(options))
      .join('\n')
  }
}
