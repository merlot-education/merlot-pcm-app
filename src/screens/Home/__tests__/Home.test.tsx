import {
  CredentialRecord,
  CredentialState,
  ProofRecord,
  ProofState,
} from '@aries-framework/core'
import {
  useCredentialByState,
  useProofByState,
} from '@aries-framework/react-hooks'
import { useNavigation } from '@react-navigation/core'
import { fireEvent, render } from '@testing-library/react-native'
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
   * Scenario: Home Screen with pending notifications
   * Given Wallet has successfully loaded
   * When the Home Screen successfully loads
   * Then the number of pending notifications is displayed in the "Home" button in the main navigation bar
   */
  it('notification label is displayed with number of notifications', async () => {
    const { findByText } = render(<Home navigation={useNavigation()} />)
    const notificationLabel = await findByText('Home.Notifications (2)')

    expect(notificationLabel).toBeTruthy()
  })

  it('Pressing the "See All" button navigates correctly', async () => {
    const navigation = useNavigation()
    const { findByText } = render(<Home navigation={useNavigation()} />)
    const seeAllButton = await findByText('Home.SeeAll')

    expect(seeAllButton).toBeTruthy()

    fireEvent(seeAllButton, 'press')

    expect(navigation.navigate).toBeCalledWith('Notifications')
  })

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
