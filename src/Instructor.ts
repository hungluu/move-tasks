import kindOf from 'kind-of'
import { get, filter, map, flatten } from './utils'

const INSTRUCTION_SEPARATOR = '.'
const LAYER_REGEX = /([^\s.(]+)(?:\(([^()]+)\))?/
// Only support single condition for now
const CONDITION_REGEX = /([^ ]+) ([^ ]+) (.+)/
const CONDITION_PARAM_SEPARATOR = /, ?/
export const InstructorFilters: { [key: string]: (...args: any[]) => boolean } = {
  in (input: any, ...params: string[]) {
    return params.includes(input)
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
  }
}

const availableFilters = Object.keys(InstructorFilters)
export default class Instructor {
  constructor (private readonly data: any) {}

  get<T extends any> (instruction: string): T[] {
    const [source, ...layers] = instruction.trim().split(INSTRUCTION_SEPARATOR)
    const dataSource: any[] = this.getLayer(this.data, source)
    let result: T[] = dataSource

    layers.forEach(layer => {
      const [, layerField, condition] = layer.match(LAYER_REGEX) as string[]

      result = this.getLayer(result, layerField)

      if (typeof condition === 'string') {
        const [, field, filterName, paramString] = condition.match(CONDITION_REGEX) as string[]
        const params = paramString !== undefined ? paramString.split(CONDITION_PARAM_SEPARATOR) : []

        if (!availableFilters.includes(filterName)) {
          throw TypeError(`Filter '${filterName}' is not supported`)
        }

        result = filter(result, item => {
          return InstructorFilters[filterName].apply(result, [
            this.getLayer(item, field), // input
            ...params
          ])
        })
      }

      return result
    })

    return result
  }

  private getLayer (data: any, fieldName: string): any[] {
    switch (kindOf(data)) {
      case 'array':
        return flatten(map(data, fieldName))
      default:
        return get(data, fieldName, [])
    }
  }
}
