import {
  CredentialRecord,
  CredentialState,
  ProofRecord,
  ProofState,
} from '@aries-framework/core'
import { useNavigation } from '@react-navigation/core'
import { render } from '@testing-library/react-native'
import React from 'react'
import { FlatList } from 'react-native'
import { create } from 'react-test-renderer'
import { NotificationListItem } from '../../../components'
import Home from '../Home'

describe('displays a home screen', () => {
  it('renders correctly', () => {
    const tree = create(<Home navigation={useNavigation()} />).toJSON()

    expect(tree).toMatchSnapshot()
  })

  /**
   * Scenario: Home Screen without any pending notification
   * Given wallet has successfully loaded
   * When the holder selects the "Home" button in the main navigation bar
   * Then the Home Screen is displayed
   * TODO:(jl) Good enough to be captured by the snapshot?
   */
  it('defaults to no notifications', async () => {
    const { findByText } = render(<Home navigation={useNavigation()} />)
    const notificationLabel = await findByText('Home.NoNewUpdates')

    expect(notificationLabel).toBeTruthy()
  })
})

describe('with a notifications module, when an issuer sends a credential offer', () => {
  const testCredentialRecords: CredentialRecord[] = [
    new CredentialRecord({
      threadId: '1',
      state: CredentialState.OfferReceived,
    }),
  ]
  const testProofRecords: ProofRecord[] = [
    new ProofRecord({
      threadId: '2',
      state: ProofState.RequestReceived,
    }),
  ]

  /**
   * Scenario: Holder receives a credential offer
   * Given the holder has a connection with an issuer
   * When the issuer sends a credential offer
   * Then the credential offer will arrive in the form of a notification in the home screen
   */
  it('notifications are displayed', () => {
    const tree = create(<Home navigation={useNavigation()} />)
    const { root } = tree
    const flatListInstance = root.findByType(FlatList)

    expect(flatListInstance.findAllByType(NotificationListItem)).toHaveLength(2)
  })
})
