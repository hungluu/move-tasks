import kindOf from 'kind-of'
import { get, filter, map, flatten } from './utils'

const INSTRUCTION_SEPARATOR = '>'
const LAYER_REGEX = /([^\s.(]+)(?:\(([^()]+)\))?/
// Only support single filter for now
const FILTER_REGEX = /([^ ]+) ([^ ]+) (.+)/
const FILTER_SEPARATOR = /\s*&\s*/
const FILTER_PARAM_SEPARATOR = /, ?/
const DATASOURCE_REGEX = /^\$/
const PATTERN_REGEX = /^\/(.+)\/([^/]+)$/

export const InstructorFilters: { [key: string]: (...args: any[]) => boolean } = {
  oneOf (input: any, ...params: string[]) {
    return params.includes(input)
  },
  in (input: any, list: any) {
    return InstructorFilters.has(list, input)
  },
  is (input: any, comparedValue: any) {
    return input === comparedValue
  },
  has (input: any, needle: any) {
    switch (kindOf(input)) {
      case 'object':
        return Object.values(input).includes(needle)
      case 'array':
        return map(input).includes(needle)
      default:
        return false
    }
  },
  // case insensitive
  hasText (input: any, needle: string) {
    if (kindOf(input) === 'string') {
      return (input as string + '').toLowerCase().includes(needle.toLowerCase())
    } else {
      return false
    }
  },
  matches (input: any, pattern: string) {
    const [, contents, flags] = pattern.match(PATTERN_REGEX) as string[]
    const regex = new RegExp(contents, flags)

    return regex.test(input)
  }
}

const availableFilters = Object.keys(InstructorFilters)
export default class Instructor {
  constructor (private readonly data: any) {}

  get<T extends any> (instruction: string): T[] {
    const [source, ...layers] = instruction.trim().split(INSTRUCTION_SEPARATOR)
    const dataSource: any[] = this.getLayer(this.data, source)

    if (!DATASOURCE_REGEX.test(source)) {
      throw TypeError('Data source should start with $')
    }

    let result: T[] = dataSource

    layers.forEach(layer => {
      result = this.applyLayer<T>(result, layer)
    })

    return result
  }

  private applyLayer<T>(result: T[], layer: string): T[] {
    const [, layerField, filters] = layer.match(LAYER_REGEX) as string[]
    const layerData = this.getLayer(result, layerField)

    if (typeof filters !== 'string') {
      return layerData
    } else if (filters.trim() === '') {
      throw TypeError(`Don't use empty filter for layer '${layerField}'`)
    } else if (!FILTER_REGEX.test(filters)) {
      throw TypeError(`Invalid filter format for layer '${layerField}'`)
    } else {
      return this.applyFilters(layerData, filters)
    }
  }

  private applyFilters<T> (result: T[], filters: string): T[] {
    let filteredResult = result.slice(0)

    filters.split(FILTER_SEPARATOR).forEach(text => {
      const [, field, filterName, paramString] = text.match(FILTER_REGEX) as string[]
      const params = paramString !== undefined ? paramString.split(FILTER_PARAM_SEPARATOR) : []
      const parsedParams = map(params, param => this.parseFilterParam(param))

      if (!availableFilters.includes(filterName)) {
        throw TypeError(`Filter '${filterName}' is not supported`)
      }

      filteredResult = filter(filteredResult, item => {
        return InstructorFilters[filterName].apply(result, [
          this.getLayer(item, field), // input
          ...parsedParams
        ])
      })
    })

    return filteredResult
  }

  private parseFilterParam (param: string): any {
    return param.startsWith('$')
      ? this.getLayer(this.data, param)
      : param
  }

  private getLayer (data: any, fieldName: string): any[] {
    switch (kindOf(data)) {
      case 'array':
        return flatten(map(data, fieldName.trim().replace(DATASOURCE_REGEX, '')))
      default:
        return get(data, fieldName.trim().replace(DATASOURCE_REGEX, ''), [])
    }
  }
}
