import React from 'react'
import { useNavigation } from '@react-navigation/core'
import { ConnectionRecord } from '@aries-framework/core'
import { fireEvent, render } from '@testing-library/react-native'
import * as hooks from '@aries-framework/react-hooks'
import { dateFormatOptions } from '../../../constants'
import { Screens } from '../../../types/navigators'
import ContactDetails from '../ContactDetails'
import { getMockConnection } from '../../../utils/testhelpers'

const connectionRecord: ConnectionRecord = {
  _tags: {
    did: 'SL2dA5wcdY8NEhkKwYeVNb',
    verkey: 'EofsWGeCGAdb3k5gepePiHvPXJkm59dQUwogP3FHHTZp',
    state: 'complete',
    role: 'invitee',
    theirDid: 'XBudZhfzGFFfcEuGyREGQy',
    invitationKey: '6PtQuy9St6hD2zJWnfxnN6aBnK3vfY7WU7WhhoZGAaz5',
    mediatorId: '68bbc5d0-7b1b-4b35-9c40-fd72ccd67f8e',
    theirKey: 'HTJdr7YPxKBb4AiapjwLG5asepcVyPJZPdcmixGqP8V3',
    threadId: '03d19628-e119-4763-9f38-0790545922c9',
  },
  metadata: {},
  id: '34da4abe-7578-464f-909c-ee19a3bdf7ac',
  createdAt: new Date('2022-04-29T06:36:48.244Z'),
  did: 'SL2dA5wcdY8NEhkKwYeVNb',
  didDoc: {
    '@context': 'https://w3id.org/did/v1',
    publicKey: [
      {
        id: 'SL2dA5wcdY8NEhkKwYeVNb#1',
        controller: 'SL2dA5wcdY8NEhkKwYeVNb',
        type: 'Ed25519VerificationKey2018',
        publicKeyBase58: 'EofsWGeCGAdb3k5gepePiHvPXJkm59dQUwogP3FHHTZp',
      },
    ],
    service: [
      {
        id: 'SL2dA5wcdY8NEhkKwYeVNb#IndyAgentService',
        serviceEndpoint: 'http://mediator3.test.indiciotech.io:3000',
        type: 'IndyAgent',
        priority: 0,
        recipientKeys: ['EofsWGeCGAdb3k5gepePiHvPXJkm59dQUwogP3FHHTZp'],
        routingKeys: ['DGYY31KpABLT4ydNHw11rRneEL8a41X4s6xqre2cAEbn'],
      },
    ],
    authentication: [
      {
        publicKey: 'SL2dA5wcdY8NEhkKwYeVNb#1',
        type: 'Ed25519SignatureAuthentication2018',
      },
    ],
    id: 'SL2dA5wcdY8NEhkKwYeVNb',
  },
  verkey: 'EofsWGeCGAdb3k5gepePiHvPXJkm59dQUwogP3FHHTZp',
  theirLabel: 'ABC',
  state: 'complete',
  role: 'invitee',
  invitation: {
    '@type': 'https://didcomm.org/connections/1.0/invitation',
    '@id': '031d7c03-51d2-488f-b53f-659bccbf03b3',
    label: 'private beta',
    recipientKeys: ['6PtQuy9St6hD2zJWnfxnN6aBnK3vfY7WU7WhhoZGAaz5'],
    imageUrl: '',
    serviceEndpoint: 'https://ws.app',
  },
  imageUrl: '',
  multiUseInvitation: false,
  mediatorId: '68bbc5d0-7b1b-4b35-9c40-fd72ccd67f8e',
  theirDid: 'XBudZhfzGFFfcEuGyREGQy',
  theirDidDoc: {
    '@context': 'https://w3id.org/did/v1',
    publicKey: [
      {
        id: 'did:sov:XBudZhfzGFFfcEuGyREGQy#1',
        controller: 'did:sov:XBudZhfzGFFfcEuGyREGQy',
        type: 'Ed25519VerificationKey2018',
        publicKeyBase58: 'HTJdr7YPxKBb4AiapjwLG5asepcVyPJZPdcmixGqP8V3',
      },
    ],
    service: [
      {
        id: 'did:sov:XBudZhfzGFFfcEuGyREGQy;indy',
        serviceEndpoint: 'https://ws.app',
        type: 'IndyAgent',
        priority: 0,
        recipientKeys: ['HTJdr7YPxKBb4AiapjwLG5asepcVyPJZPdcmixGqP8V3'],
      },
    ],
    authentication: [
      {
        publicKey: 'did:sov:XBudZhfzGFFfcEuGyREGQy#1',
        type: 'Ed25519SignatureAuthentication2018',
      },
    ],
    id: 'did:sov:XBudZhfzGFFfcEuGyREGQy',
  },
  threadId: '03d19628-e119-4763-9f38-0790545922c9',
}

const props = {
  params: { connectionId: '40812491-c7a5-4dd7-b4a5-a9202a9d737a' },
}

describe('Contact Details Component', () => {
  jest.mock('react-native-toast-message', () => ({
    show: jest.fn(),
    hide: jest.fn(),
  }))

  it('testing', () => {
    // jest,spyOn(hooks,'useConnectionById').mockImplementation(() => getMockConnection({id:'tesid',theirLabel:'test-label'}))
    const { getByTestId, getByText } = render(
      <ContactDetails
        route={{
          params: { connectionId: connectionRecord.id },
          key: '',
          name: Screens.ContactDetails,
        }}
        navigation={useNavigation()}
      />,
    )
    const name = getByText('private beta')
    const didText = getByText('DID : SL2dA5wcdY8NEhkKwYeVNb')
    const stateText = getByText('State : complete')
    // const createdAt = getByText('2022-04-29T06:36:48.244Z')

    expect(name.props.children).toBe(connectionRecord?.invitation?.label)
    expect(didText.props.children[1]).toBe(connectionRecord?.did)
    expect(stateText.props.children[1]).toBe(connectionRecord.state)
  })

  // expect(createdAt.props.children[1]).toBe(connectionRecord.createdAt.toLocaleDateString(
  //   'en-CA',
  //   dateFormatOptions))
})
