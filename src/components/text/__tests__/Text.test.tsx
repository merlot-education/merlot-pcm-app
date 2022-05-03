import React from 'react'
import { render } from '@testing-library/react-native'
import HighlightTextBox from '../HighlightTextBox'
import InfoTextBox from '../InfoTextBox'
import Text from '../Text'
import Title from '../Title'

describe('Text Component', () => {
  it('should render highlight text correctly', () => {
    const { container, getByLabelText } = render(
      <HighlightTextBox>HighlightTextBox</HighlightTextBox>,
    )
    expect(container).toMatchSnapshot()
    expect(getByLabelText('HighlightTextBox')).toBeTruthy()
  })

  it('should render info text correctly', () => {
    const { container, getByLabelText } = render(
      <InfoTextBox>InfoTextBox</InfoTextBox>,
    )
    expect(container).toMatchSnapshot()
    expect(getByLabelText('InfoTextBox')).toBeTruthy()
  })

  it('should render text correctly', () => {
    const { container, getByLabelText } = render(<Text>Text</Text>)
    expect(container).toMatchSnapshot()
    expect(getByLabelText('Text')).toBeTruthy()
  })

  it('should render title correctly', () => {
    const { container, getByLabelText } = render(<Title>Title</Title>)
    expect(container).toMatchSnapshot()
    expect(getByLabelText('Title')).toBeTruthy()
  })
})
