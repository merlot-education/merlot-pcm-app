import React from 'react'
import { create } from 'react-test-renderer'

import Button, { ButtonType } from '../../src/components/button/Button'

describe('Button Component', () => {
  it('Primary renders correctly', () => {
    const tree = create(
      <Button
        title="Hello Primary"
        onPress={() => {}}
        buttonType={ButtonType.Primary}
      />,
    ).toJSON()

    expect(tree).toMatchSnapshot()
  })

  it('Secondary renders correctly', () => {
    const tree = create(
      <Button
        title="Hello Secondary"
        onPress={() => {}}
        buttonType={ButtonType.Secondary}
      />,
    ).toJSON()

    expect(tree).toMatchSnapshot()
  })
})
