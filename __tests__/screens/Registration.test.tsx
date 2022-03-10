import React from 'react'
import { create } from 'react-test-renderer'
import Registration from '../../src/screens/Registration'

jest.mock('react-native-keychain', () => 'Registration')
jest.mock('react-native-config', () => 'Registration')

describe('Registration Screen', () => {
  it('Renders correctly', () => {
    const tree = create(<Registration />).toJSON()

    expect(tree).toMatchSnapshot()
  })
})
