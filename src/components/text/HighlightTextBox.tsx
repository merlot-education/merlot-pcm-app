import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { ColorPallet, TextTheme } from '../../theme/theme'

export interface TextBoxProps {
  children: string
}

const offset = 10

const style = StyleSheet.create({
  icon: {
    marginRight: offset,
  },
  container: {
    flexDirection: 'row',
    backgroundColor: ColorPallet.grayscale.white,
  },
  accentBox: {
    marginRight: offset,
    backgroundColor: ColorPallet.baseColors.yellow,
    width: 8,
  },
  headerText: {
    ...TextTheme.normal,
    flexShrink: 1,
  },
})

const HighlightTextBox: React.FC<TextBoxProps> = ({ children }) => {
  return (
    <View style={[style.container]}>
      <View style={[style.accentBox]} />
      <Text
        style={[
          style.headerText,
          { paddingTop: offset, paddingBottom: offset },
        ]}
      >
        {children}
      </Text>
    </View>
  )
}

export default HighlightTextBox
