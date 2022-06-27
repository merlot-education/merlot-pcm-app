import { RequestedAttribute } from '@aries-framework/core'

export interface Attribute {
  name: string
  value: RequestedAttribute
  values?: RequestedAttribute[]
}
