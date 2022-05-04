import React from 'react'
import { render } from '@testing-library/react-native'
import Loader from '../Loader'

describe('Toast Component', () => {
  it('should render loader start correctly', () => {
    const { getByTestId } = render(<Loader loading />)
    const loader = getByTestId('loader')
    expect(loader.props.visible).toBe(true)
  })
  it('should render loader close correctly', () => {
    const { getByTestId } = render(<Loader loading={false} />)
    const loader = getByTestId('loader')
    expect(loader.props.visible).toBe(false)
  })
})
