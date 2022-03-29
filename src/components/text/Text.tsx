import React from 'react'
import { Text as T, StyleSheet, TextStyle, StyleProp } from 'react-native'
import { Colors } from '../../theme/theme'

const styles = StyleSheet.create({
  text: {
    color: Colors.text,
  },
})

type Props = {
  children: React.ReactNode
  style?: StyleProp<TextStyle>
}

const Text: React.FC<Props> = ({ children, style }) => {
  return <T style={[styles.text, style]}>{children}</T>
}

export default Text
