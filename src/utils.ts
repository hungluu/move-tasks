import pickBy from 'lodash-es/pickBy'
import lodashZipObject from 'lodash-es/zipObject'
import lodashMap from 'lodash-es/map'

export { default as flatten } from 'lodash-es/flatten'
export { default as get } from 'lodash-es/get'
export { default as filter } from 'lodash-es/filter'

export const map = lodashMap
export const zipObject = lodashZipObject

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
