import React from 'react'
import { useNavigation } from '@react-navigation/core'
import { fireEvent, render } from '@testing-library/react-native'
import { Screens } from '../../../types/navigators'
import ContactDetails from '../ContactDetails'
import { useConnectionById } from '../../../../__mocks__/@aries-framework/react-hooks'
import { getMockConnection } from '../../../utils/testhelpers'

describe('ContactDetails', () => {
  it('testing', () => {
    useConnectionById.mockImplementation(() =>
      getMockConnection({ id: 'tesid', theirLabel: 'test-label' }),
    )
    const { getByText } = render(
      <ContactDetails
        route={{
          params: { connectionId: 'connectionRecord.id ' },
          key: '',
          name: Screens.ContactDetails,
        }}
        navigation={useNavigation()}
      />,
    )
    const name = getByText('test-label')
    // const didText = getByText('DID : SL2dA5wcdY8NEhkKwYeVNb')
    // const stateText = getByText('State : complete')
    // // const createdAt = getByText('2022-04-29T06:36:48.244Z')
    expect(name.props.children).toBe('test-label')
    // expect(didText.props.children[1]).toBe(connectionRecord?.did)
    // expect(stateText.props.children[1]).toBe(connectionRecord.state)
  })
})
