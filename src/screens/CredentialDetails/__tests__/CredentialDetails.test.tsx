import React from 'react'
import { fireEvent, render } from '@testing-library/react-native'
import {
  CredentialMetadataKeys,
  CredentialPreviewAttribute,
  CredentialRecord,
  CredentialState,
} from '@aries-framework/core'
import CredentialDetails from '../CredentialDetails'
import CredentialCard from '../../../components/misc/CredentialCard'
import { Screens } from '../../../types/navigators'
import AvatarView from '../../../components/misc/AvatarView'

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
    const { getByText, getByTestId } = render(
      <CredentialDetails
        route={{
          params: { credentialId: 'credentialRecord.id' },
          key: '',
          name: Screens.ContactDetails,
        }}
        navigation={mockedNavigate()}
      />,
    )
  })

  it('should render record header correctly', () => {
    const { getByTestId } = render(
      <CredentialCard credential={credentialRecord} />,
    )
    const recordHeader = getByTestId('credentialRecord')
    fireEvent.press(recordHeader)
  })
  //   it.each([
  //     [[credentialRecord], [credentialRecord]],
  //   ])(
  //     'should show credential card',
  //     (credential,  expected) => {

  //       const testCredCard = render (
  //           <AvatarView name={'testschema'}  />
  //       )

  //       console.log('card',testCredCard)

  //     },
  //   )
})
