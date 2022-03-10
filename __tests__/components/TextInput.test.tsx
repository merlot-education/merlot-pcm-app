import React from 'react'
import { create } from 'react-test-renderer'

import TextInput from '../../src/components/inputs/TextInput'

describe('TextInput Component', () => {
  it('TextInput renders correctly', () => {
    const tree = create(<TextInput label="TextInput Component" />).toJSON()

    expect(tree).toMatchSnapshot()
  })
})
