import React from 'react'
import { render } from '@testing-library/react-native'
import BaseToast, { ToastType } from '../BaseToast'

describe('Toast Component', () => {
  it('should render success toast correctly', () => {
    const { container, getByLabelText } = render(
      <BaseToast
        title="SuccessToastTitle"
        toastType={ToastType.Success}
        body="Success Toast Message"
      />,
    )
    expect(container).toMatchSnapshot()
    expect(getByLabelText('SuccessToastTitle')).toBeTruthy()
  })

  it('should render info toast correctly', () => {
    const { container, getByLabelText } = render(
      <BaseToast
        title="InfoToastTitle"
        toastType={ToastType.Info}
        body="Info Toast Message"
      />,
    )
    expect(container).toMatchSnapshot()
    expect(getByLabelText('InfoToastTitle')).toBeTruthy()
  })

  it('should render warn toast correctly', () => {
    const { container, getByLabelText } = render(
      <BaseToast
        title="WarnToastTitle"
        toastType={ToastType.Warn}
        body="Warn Toast Message"
      />,
    )
    expect(container).toMatchSnapshot()
    expect(getByLabelText('WarnToastTitle')).toBeTruthy()
  })

  it('should render error toast correctly', () => {
    const { container, getByLabelText } = render(
      <BaseToast
        title="ErrorToastTitle"
        toastType={ToastType.Error}
        body="Error Toast Message"
      />,
    )
    expect(container).toMatchSnapshot()
    expect(getByLabelText('ErrorToastTitle')).toBeTruthy()
  })
})
