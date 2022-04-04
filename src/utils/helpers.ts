/* eslint-disable no-bitwise */
import {
  ConnectionRecord,
  CredentialMetadataKeys,
  CredentialRecord,
  ProofRecord,
  RequestedAttribute,
} from '@aries-framework/core'
import React from 'react'
import {
  useConnectionById as getConnectionById,
  useProofById as getProofById,
} from '@aries-framework/react-hooks'

export const connectionRecordFromId = (connectionId: string) => {
  const connection = getConnectionById(connectionId)
  return connection
}

export function parseSchema(schemaId?: string): {
  name: string
  version: string
} {
  let name = 'Credential'
  let version = ''
  if (schemaId) {
    const schemaIdRegex = /(.*?):([0-9]):([a-zA-Z .\-_0-9]+):([a-z0-9._-]+)$/
    const schemaIdParts = schemaId.match(schemaIdRegex)
    if (schemaIdParts?.length === 5) {
      name = `${schemaIdParts?.[3].replace(/_|-/g, ' ')}`
        .split(' ')
        .map(
          schemaIdPart =>
            schemaIdPart.charAt(0).toUpperCase() + schemaIdPart.substring(1),
        )
        .join(' ')
      version = schemaIdParts?.[4]
    }
  }
  return { name, version }
}

export function credentialSchema(
  credential: CredentialRecord,
): string | undefined {
  return credential.metadata.get(CredentialMetadataKeys.IndyCredential)
    ?.schemaId
}

export function parsedSchema(credential: CredentialRecord): {
  name: string
  version: string
} {
  return parseSchema(credentialSchema(credential))
}

export function hashCode(s: string): number {
  return s
    .split('')
    .reduce((hash, char) => char.charCodeAt(0) + ((hash << 5) - hash), 0)
}

export function hashToRGBA(i: number) {
  const colour = (i & 0x00ffffff).toString(16).toUpperCase()
  return `#${'00000'.substring(0, 6 - colour.length)}${colour}`
}
export const MainStackContext = React.createContext(null)

export const proofRecordFromId = (proofId: string): ProofRecord | void => {
  // if (proofId) {
  return getProofById(proofId)
  // }
}

export function getConnectionName(connection: ConnectionRecord): string | void {
  return connection?.alias || connection?.invitation?.label
}

export function firstAttributeCredential(
  attributes: RequestedAttribute[],
  revoked = true,
): RequestedAttribute | null {
  if (!attributes.length) {
    return null
  }

  let first = null
  const firstNonRevoked = attributes.filter(attribute => !attribute.revoked)[0]
  if (firstNonRevoked) {
    first = firstNonRevoked
  } else if (attributes.length && revoked) [first] = attributes

  if (!first?.credentialInfo) {
    return null
  }

  return first
}

export const valueFromAttributeCredential = (
  name: string,
  credential: RequestedAttribute,
) => {
  if (!credential) {
    return ''
  }
  return credential.credentialInfo?.attributes[name]
}

export const getCredDefName = (credentialDefinitionId: string) => {
  const data = credentialDefinitionId.split(':')
  return data[data.length - 1]
}

export const getSchemaNameFromSchemaId = (schemaId: string) => {
  const data = schemaId.split(':')
  return data[data.length - 1]
}
