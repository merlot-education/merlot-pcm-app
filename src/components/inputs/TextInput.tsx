import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TextInput as RNTextInput,
  TextInputProps,
} from 'react-native'

import { ColorPallet, TextTheme, borderRadius } from '../../theme/theme'

interface Props extends TextInputProps {
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
    backgroundColor: ColorPallet.grayscale.white,
    color: ColorPallet.brand.primary,
    borderWidth: 2,
    borderColor: ColorPallet.baseColors.green,
  },
})

const TextInput: React.FC<Props> = ({ label, ...textInputProps }) => {
  const [focused, setFocused] = useState(false)

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <RNTextInput
        style={[
          styles.textInput,
          focused && { borderColor: ColorPallet.brand.primary },
        ]}
        selectionColor={ColorPallet.brand.primary}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        {...textInputProps}
      />
    </View>
  )
}

export default TextInput
