import React from 'react'
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'

import { ColorPallet, TextTheme } from '../../theme/theme'

interface Props {
  title: string
  accessibilityLabel?: string
  checked: boolean
  onPress: () => void
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    margin: 10,
  },
  text: {
    flexShrink: 1,
    ...TextTheme.normal,
    marginLeft: 10,
  },
})

const CheckBoxRow: React.FC<Props> = ({
  title,
  accessibilityLabel,
  checked,
  onPress,
}) => {
  const accessible = !!(accessibilityLabel && accessibilityLabel !== '')

  return (
    <View style={style.container} testID="checkBoxRowView">
      <TouchableOpacity
        style={style.container}
        testID="checkBoxRow"
        accessible={accessible}
        accessibilityLabel={accessibilityLabel}
        onPress={onPress}
      >
        {checked ? (
          <Icon name="check-box" size={36} color={ColorPallet.brand.primary} />
        ) : (
          <Icon
            name="check-box-outline-blank"
            size={36}
            color={ColorPallet.brand.primary}
          />
        )}
        <Text style={[style.text]}>{title}</Text>
      </TouchableOpacity>
    </View>
  )
}

export default CheckBoxRow
