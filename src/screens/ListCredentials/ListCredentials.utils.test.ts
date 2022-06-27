import {
  CredentialMetadataKeys,
  V1CredentialPreview,
  CredentialExchangeRecord,
  CredentialState,
} from '@aries-framework/core'
import * as Utils from './ListCredentials.utils'

const credentialRecord = new CredentialExchangeRecord({
  connectionId: '28790bfe-1345-4c64-b21a-7d98982b3894',
  threadId: 'threadId',
  state: CredentialState.Done,
  credentialAttributes: [
    new V1CredentialPreview({
      name: 'age',
      value: '25',
    }),
  ],
})
credentialRecord.metadata.set(CredentialMetadataKeys.IndyCredential, {
  credentialDefinitionId: 'Th7MpTaRZVRYnPiabds81Y:3:CL:17:TA',
  schemaId: 'TL1EaPFCZ8Si5aUrqScBDt:2:testschema:1.0',
})
const credentialRecord1 = new CredentialExchangeRecord({
  connectionId: '28790bfe-1345-4c64-b21a-7d98982b3894',
  threadId: 'threadId',
  state: CredentialState.Done,
  credentialAttributes: [
    new V1CredentialPreview({
      name: 'age',
      value: '25',
    }),
  ],
})
credentialRecord1.metadata.set(CredentialMetadataKeys.IndyCredential, {
  credentialDefinitionId: 'Th7MpTaRZVRYnPiabds81Y:3:CL:17:TAG',
  schemaId: 'TL1EaPFCZ8Si5aUrqScBDt:2:Identity:1.0',
})

describe('ListCredentials.utils', () => {
  describe('searchCredentialsList', () => {
    it.each([
      [[credentialRecord, credentialRecord1], 'identity', [credentialRecord1]],
    ])(
      'should return a filtered list of connections',
      (credential, searchText, expected) => {
        const result = Utils.searchCredentialsList(credential, searchText)
        expect(result).toEqual(expected)
      },
    )
  })
})
