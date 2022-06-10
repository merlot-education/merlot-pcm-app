import React from 'react'
import { render } from '@testing-library/react-native'
import {
  CredentialMetadataKeys,
  V1CredentialPreview,
  CredentialExchangeRecord,
  CredentialState,
  CredentialPreviewAttribute,
  CredentialProtocolVersion,
} from '@aries-framework/core'
import CredentialDetails from '../CredentialDetails'
import { Screens } from '../../../types/navigators'
import { parsedSchema } from '../../../utils/helpers'

const credentialRecord = new CredentialExchangeRecord({
  connectionId: '28790bfe-1345-4c64-b21a-7d98982b3894',
  threadId: 'threadId',
  state: CredentialState.Done,
  credentialAttributes: [
    new CredentialPreviewAttribute({
      name: 'age',
      value: '25',
    }),
  ],
  protocolVersion: CredentialProtocolVersion.V1,
})

const mockedNavigate = jest.fn()
credentialRecord.metadata.set(CredentialMetadataKeys.IndyCredential, {
  credentialDefinitionId: 'Th7MpTaRZVRYnPiabds81Y:3:CL:17:TA',
  schemaId: 'TL1EaPFCZ8Si5aUrqScBDt:2:testschema:1.0',
})
describe('CredentialDetails', () => {
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

  it('testing', () => {
    const { getByText } = render(
      <CredentialDetails
        route={{
          params: { credentialId: credentialRecord.id },
          key: '',
          name: Screens.CredentialDetails,
        }}
        navigation={mockedNavigate()}
      />,
    )
    const name = getByText(parsedSchema(credentialRecord).name)

    expect(name.props.children).toBe(parsedSchema(credentialRecord).name)
  })
})
