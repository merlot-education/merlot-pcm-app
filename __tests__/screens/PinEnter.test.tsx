import React from 'react'
import { create } from 'react-test-renderer'
import PinEnter from '../../src/screens/PinEnter'

jest.mock('react-native-keychain', () => 'PinEnter')
jest.mock('react-native-config', () => 'PinEnter')

describe('PinEnter Screen', () => {
  it('PinEnter correctly', () => {
    const tree = create(<PinEnter />).toJSON()

    expect(tree).toMatchSnapshot()
  })
})
