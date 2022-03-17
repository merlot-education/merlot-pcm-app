import React from 'react'
import { ViewStyle } from 'react-native'

import { Button as AntButton } from '@ant-design/react-native'

export enum ButtonType {
  Primary = 'primary',
  Warning = 'warning',
  Ghost = 'ghost',
  Secondary = 'Secondary',
}

interface ButtonProps {
  title: string
  buttonType: ButtonType
  onPress?: () => void
  disabled?: boolean
  buttonStyle?: ViewStyle
}

const Button: React.FC<ButtonProps> = ({
  title,
  buttonType = ButtonType.Primary,
  buttonStyle,
  onPress,
  disabled = false,
}) => {
  return (
    <AntButton
      type={buttonType}
      style={buttonStyle}
      disabled={disabled}
      onPress={onPress}
    >
      {title}
    </AntButton>
  )
}

export default Button
