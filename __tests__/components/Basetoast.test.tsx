import React from 'react'
import { create } from 'react-test-renderer'

import BaseToast, { ToastType } from '../../src/components/toast/BaseToast'

describe('BaseToast Component', () => {
  it('Info renders correctly', () => {
    const tree = create(
      <BaseToast
        title="Info"
        body="This is info message"
        toastType={ToastType.Info}
      />,
    ).toJSON()

    expect(tree).toMatchSnapshot()
  })

  it('Success renders correctly', () => {
    const tree = create(
      <BaseToast
        title="Success"
        body="This is Success message"
        toastType={ToastType.Success}
      />,
    ).toJSON()

    expect(tree).toMatchSnapshot()
  })

  it('Warn renders correctly', () => {
    const tree = create(
      <BaseToast
        title="Warn"
        body="This is warning message"
        toastType={ToastType.Warn}
      />,
    ).toJSON()

    expect(tree).toMatchSnapshot()
  })

  it('Error renders correctly', () => {
    const tree = create(
      <BaseToast
        title="Error"
        body="This is error message"
        toastType={ToastType.Error}
      />,
    ).toJSON()

    expect(tree).toMatchSnapshot()
  })
})
