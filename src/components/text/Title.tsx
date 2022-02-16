import React from 'react'
import { Text, StyleSheet, TextStyle } from 'react-native'
import { Colors } from '../../theme/theme'

interface Props {
  children: React.ReactNode
  style?: TextStyle
}

const styles = StyleSheet.create({
  title: {
    fontWeight: 'bold',
    fontSize: 20,
    color: Colors.text,
  },
})

const Title: React.FC<Props> = ({ children, style }) => {
  return <Text style={[styles.title, style]}>{children}</Text>
}

export default Title
