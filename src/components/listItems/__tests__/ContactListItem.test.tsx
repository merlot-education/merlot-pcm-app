import { ConnectionRecord } from '@aries-framework/core'
import { useNavigation } from '@react-navigation/core'
import { fireEvent, render } from '@testing-library/react-native'
import React from 'react'
import ContactListItem from '../ContactListItem'

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

describe('ContactListItem', () => {
  it('should render connection details correctly when connection record is passed as prop', () => {
    const navigation = useNavigation()
    const { getByTestId, getByText } = render(
      <ContactListItem contact={connectionRecord} />,
    )
    const label = getByText('private beta')
    const didText = getByText('DID : SL2dA5wcdY8NEhkKwYeVNb')
    const stateText = getByText('State : complete')
    expect(label.props.children).toBe(connectionRecord?.invitation?.label)
    expect(didText.props.children[1]).toBe(connectionRecord?.did)
    expect(stateText.props.children[1]).toBe(connectionRecord.state)

    const contactListItem = getByTestId('contact-list-item')
    fireEvent.press(contactListItem)
    expect(navigation.navigate).toHaveBeenCalledWith('ConnectionDetails', {
      connectionId: '34da4abe-7578-464f-909c-ee19a3bdf7ac',
    })
  })
})
