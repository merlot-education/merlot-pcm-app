import React from 'react'
import { create } from 'react-test-renderer'

import Loader from '../../src/components/loader/Loader'

describe('Loader Component', () => {
  it('Loader renders correctly', () => {
    const tree = create(<Loader />).toJSON()

    expect(tree).toMatchSnapshot()
  })
})
