import React from 'react'
import { fireEvent, render } from '@testing-library/react-native'
import SafeAreaScrollView from '../SafeAreaScrollView'
import ProofRequestAttribute from '../ProofRequestAttribute'

describe('ProofRequestAttribute Component', () => {
  it('should render proof request attribute correctly', () => {
    const proofRequest = [
      {
        item: 'JoieDon',
        credentials: ['JoieDon'],
        names: ['JoieDon', 'JoieDon1'],
        values: ['JoieDon', 'JoieDon1'],
      },
      {
        item: 'JoieDon1',
        credentials: ['JoieDon'],
        names: ['JoieDon', 'JoieDon1'],
        values: ['JoieDonvalues', 'JoieDonvalues1'],
      },
    ]
    const { getByTestId } = render(
      <ProofRequestAttribute proofRequest={proofRequest} />,
    )
    const proofRequestAttribute = getByTestId('proofRequestAttribute')
    fireEvent.press(proofRequestAttribute)
  })
  it('should render safeareaview correctly', () => {
    const { getByTestId } = render(
      <SafeAreaScrollView>safeareaview</SafeAreaScrollView>,
    )
    const safeareaview = getByTestId('safeareaview')
    fireEvent.press(safeareaview)
  })
})
