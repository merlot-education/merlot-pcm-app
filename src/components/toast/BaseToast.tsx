import React from 'react'
import { View, Text, useWindowDimensions, StyleSheet } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'

import {
  TextTheme,
  borderRadius,
  borderWidth,
  ColorPallet,
} from '../../theme/theme'

interface BaseToastProps {
  title: string
  body: string
  toastType: string
}

export enum ToastType {
  Success = 'success',
  Info = 'info',
  Warn = 'warn',
  Error = 'error',
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'flex-start',
    flexDirection: 'row',
    borderWidth,
    borderRadius,
  },
  textContainer: {
    flexShrink: 1,
    marginVertical: 10,
    marginRight: 10,
  },
  icon: {
    marginTop: 15,
    marginHorizontal: 15,
  },
  title: {
    fontWeight: 'bold',
  },
  body: {
    marginTop: 10,
  },
})

const BaseToast: React.FC<BaseToastProps> = ({ title, body, toastType }) => {
  const { width } = useWindowDimensions()
  const iconSize = 24
  let iconName = ''
  let backgroundColor = ''
  let borderColor = ''
  let iconColor = ''
  let textColor = ''

  switch (toastType) {
    case ToastType.Success:
      iconName = 'check-circle'
      backgroundColor = ColorPallet.notification.success
      borderColor = ColorPallet.notification.successBorder
      iconColor = ColorPallet.notification.successIcon
      textColor = ColorPallet.notification.successText
      break

    case ToastType.Info:
      iconName = 'info'
      backgroundColor = ColorPallet.notification.info
      borderColor = ColorPallet.notification.infoBorder
      iconColor = ColorPallet.notification.infoIcon
      textColor = ColorPallet.notification.infoText
      break

    case ToastType.Warn:
      iconName = 'report-problem'
      backgroundColor = ColorPallet.notification.warn
      borderColor = ColorPallet.notification.warnBorder
      iconColor = ColorPallet.notification.warnIcon
      textColor = ColorPallet.notification.warnText
      break

    case ToastType.Error:
      iconName = 'error'
      backgroundColor = ColorPallet.notification.error
      borderColor = ColorPallet.notification.errorBorder
      iconColor = ColorPallet.notification.errorIcon
      textColor = ColorPallet.notification.errorText
      break

    default:
      throw new Error('ToastType was not set correctly.')
  }

  return (
    <View
      style={[
        styles.container,
        { backgroundColor, borderColor, width: width - width * 0.1 },
      ]}
    >
      <Icon
        style={styles.icon}
        name={iconName}
        color={iconColor}
        size={iconSize}
      />
      <View style={[styles.textContainer]}>
        <Text style={[TextTheme.normal, styles.title, { color: textColor }]}>
          {title}
        </Text>
        <Text style={[TextTheme.label, styles.body, { color: textColor }]}>
          {body}
        </Text>
      </View>
    </View>
  )
}

export default BaseToast
