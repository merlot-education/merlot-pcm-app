import React, { useState } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { InputItem } from '@ant-design/react-native'

import { InputItemProps } from '@ant-design/react-native/lib/input-item'
import { Colors, TextTheme, borderRadius } from '../../theme/theme'

interface Props extends InputItemProps {
  label: string
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  label: {
    ...TextTheme.label,
    marginBottom: 3,
  },
  textInput: {
    padding: 10,
    borderRadius,
    fontSize: 16,
    backgroundColor: Colors.background,
    color: Colors.text,
    borderWidth: 2,
  },
})

const TextInput: React.FC<Props> = ({ label, ...InputItemProps }) => {
  const [focused, setFocused] = useState(false)

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <InputItem
        style={[styles.textInput, focused && { borderColor: Colors.primary }]}
        selectionColor={Colors.primary}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        {...InputItemProps}
      />
    </View>
  )
}

export default TextInput
