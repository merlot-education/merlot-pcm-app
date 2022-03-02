import React, { useState, useEffect } from 'react'
import { Alert, Keyboard, StyleSheet, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'
import { Colors, TextTheme } from '../theme/theme'
import { TextInput } from '../components'
import Button, { ButtonType } from '../components/button/Button'
import Screens from '../utils/constants'

interface VerifyOtpProps {
  navigation: any
}

const style = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    margin: 20,
  },
  bodyText: {
    ...TextTheme.normal,
    flexShrink: 1,
  },
  verticalSpacer: {
    marginVertical: 20,
    textAlign: 'center',
  },
})

const RESEND_OTP_TIME_LIMIT = 60 // 60 secs

let resendOtpTimerInterval

const VerifyOtp: React.FC<VerifyOtpProps> = ({ navigation }) => {
  const [otp, setOtp] = useState('')

  const { t } = useTranslation()

  // in secs, if value is greater than 0 then button will be disabled
  const [resendButtonDisabledTime, setResendButtonDisabledTime] = useState(
    RESEND_OTP_TIME_LIMIT,
  )

  const startResendOtpTimer = () => {
    if (resendOtpTimerInterval) {
      clearInterval(resendOtpTimerInterval)
    }
    resendOtpTimerInterval = setInterval(() => {
      if (resendButtonDisabledTime <= 0) {
        clearInterval(resendOtpTimerInterval)
      } else {
        setResendButtonDisabledTime(resendButtonDisabledTime - 1)
      }
    }, 1000)
  }

  useEffect(() => {
    startResendOtpTimer()

    return () => {
      if (resendOtpTimerInterval) {
        clearInterval(resendOtpTimerInterval)
      }
    }
  })

  const confirmEntry = (otp: string) => {
    if (otp.length < 4) {
      Alert.alert(t('Registration.EnterEmail'))
    } else {
      navigation.navigate(Screens.CreatePin)
    }
  }
  return (
    <SafeAreaView style={[style.container]}>
      <TextInput
        label={t('Global.Otp')}
        placeholder={t('Global.Otp')}
        placeholderTextColor={Colors.lightGrey}
        accessible
        accessibilityLabel={t('Global.Otp')}
        maxLength={4}
        autoFocus
        type="numeric"
        value={otp}
        onChangeText={setOtp}
      />
      <Text
        style={[style.bodyText, style.verticalSpacer]}
      >{`00.${resendButtonDisabledTime}`}</Text>
      <Text style={[style.bodyText, style.verticalSpacer]}>
        {t('Registration.ResendOtp')}
      </Text>
      <Button
        title={t('Global.Verify')}
        buttonType={ButtonType.Primary}
        onPress={() => {
          Keyboard.dismiss()
          confirmEntry(otp)
        }}
      />
    </SafeAreaView>
  )
}

export default VerifyOtp
