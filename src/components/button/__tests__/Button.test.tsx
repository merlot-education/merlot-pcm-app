import React from 'react'
import { render } from '@testing-library/react-native'
import Button, { ButtonType } from '../Button'

describe('Button Component', () => {
  it('should render primary button correctly', () => {
    const { container, getByLabelText } = render(
      <Button title="PrimaryButton" buttonType={ButtonType.Primary} />,
    )
    expect(container).toMatchSnapshot()
    expect(getByLabelText('PrimaryButton')).toBeTruthy()
  })

  it('should render warning button correctly', () => {
    const { container, getByLabelText } = render(
      <Button title="WarningButton" buttonType={ButtonType.Warning} />,
    )
    expect(container).toMatchSnapshot()
    expect(getByLabelText('WarningButton')).toBeTruthy()
  })

  it('should render ghost button correctly', () => {
    const { container, getByLabelText } = render(
      <Button title="GhostButton" buttonType={ButtonType.Ghost} />,
    )
    expect(container).toMatchSnapshot()
    expect(getByLabelText('GhostButton')).toBeTruthy()
  })
})
