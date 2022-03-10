import React from 'react'
import { create } from 'react-test-renderer'
import Home from '../../src/screens/Splash'

jest.mock('react-native-splash-screen', () => 'Splash')
jest.mock('react-native-keychain', () => 'Splash')

describe('Splash Screen', () => {
  it('Renders correctly', () => {
    const tree = create(<Home />).toJSON()

    expect(tree).toMatchSnapshot()
  })
})
