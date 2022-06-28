import { RequestedAttribute } from '@aries-framework/core'

export interface Attribute {
  name: string
  value: RequestedAttribute
  values?: RequestedAttribute[]
}

export interface RecordHistory {
  timestamp: string
  connectionLabel: string
  status: string
  attributes: Record<string, string>
}
