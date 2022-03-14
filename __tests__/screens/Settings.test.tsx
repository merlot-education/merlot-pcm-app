import React from 'react'
import { create } from 'react-test-renderer'
import Settings from '../../src/screens/Settings'

jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter')
jest.mock('react-native-device-info', () => {
  return {
    getVersion: () => 1,
    getBuildNumber: () => 1,
  }
})

describe('Home Screen', () => {
  it('Renders correctly', () => {
    const tree = create(<Settings />).toJSON()

    expect(tree).toMatchSnapshot()
  })
})
