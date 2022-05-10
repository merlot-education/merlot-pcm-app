import { fireEvent, render } from '@testing-library/react-native'
import React from 'react'
import Language from '../Language'

describe('Language', () => {
  it('should render credential details correctly when credential record is passed as prop', () => {
    // const navigation = useNavigation()
    const { getByTestId } = render(<Language />)

    // const credentialListItem = getByTestId('credential-list-item')
    // fireEvent.press(credentialListItem)
    // expect(navigation.navigate).toHaveBeenCalledWith('Credential Details', {
    //   credentialId: credentialRecord.id,
    // })
  })
})
