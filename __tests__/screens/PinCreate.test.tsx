import React from 'react'
import { create } from 'react-test-renderer'
import PinCreate from '../../src/screens/PinCreate'

jest.mock('react-native-keychain', () => 'PinCreate')
jest.mock('react-native-config', () => 'PinCreate')

describe('PinCreate Screen', () => {
  it('PinCreate correctly', () => {
    const tree = create(<PinCreate />).toJSON()

    expect(tree).toMatchSnapshot()
  })
})
