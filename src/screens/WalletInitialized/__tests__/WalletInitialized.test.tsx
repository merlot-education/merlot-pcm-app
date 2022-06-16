import { fireEvent, render } from '@testing-library/react-native'
import React from 'react'
import WalletInitialized from '../WalletInitialized'

describe('Wallet Initialization', () => {
  it('should render correctly and respond when pressed', () => {
    const { getByTestId } = render(
      <WalletInitialized navigation={undefined} route={undefined} />,
    )
  })
})
