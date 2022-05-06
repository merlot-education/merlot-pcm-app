import {
  CredentialMetadataKeys,
  CredentialPreviewAttribute,
  CredentialRecord,
  CredentialState,
} from '@aries-framework/core'

const credentialRecord = new CredentialRecord({
  connectionId: '28790bfe-1345-4c64-b21a-7d98982b3894',
  threadId: 'threadId',
  state: CredentialState.Done,
  credentialAttributes: [
    new CredentialPreviewAttribute({
      name: 'age',
      value: '25',
    }),
  ],
})
const mockedNavigate = jest.fn()
credentialRecord.metadata.set(CredentialMetadataKeys.IndyCredential, {
  credentialDefinitionId: 'Th7MpTaRZVRYnPiabds81Y:3:CL:17:TA',
  schemaId: 'TL1EaPFCZ8Si5aUrqScBDt:2:testschema:1.0',
})
describe('CredentialOffer', () => {
  jest.mock('react-native', () => {
    const RN = jest.requireActual('react-native')

    return Object.setPrototypeOf(
      {
        Alert: {
          ...RN.Alert,
          alert: jest.fn(),
        },
      },
      RN,
    )
  })

  jest.mock('@react-navigation/native', () => {
    const actualNav = jest.requireActual('@react-navigation/native')
    return {
      ...actualNav,
      useNavigation: () => ({
        navigate: mockedNavigate,
      }),
    }
  })
})
