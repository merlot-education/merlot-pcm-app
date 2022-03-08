import React from 'react'
import { create } from 'react-test-renderer'

import CheckBoxRow from '../../src/components/checkbox/CheckBoxRow'

jest.mock('react-native-vector-icons/MaterialIcons', () => 'Icon')

describe('CheckBoxRow Component', () => {
  it('CheckBoxRow renders correctly', () => {
    const tree = create(
      <CheckBoxRow title="CheckBoxRow" checked={false} />,
    ).toJSON()

    expect(tree).toMatchSnapshot()
  })
})
