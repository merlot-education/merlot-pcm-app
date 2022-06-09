import React, { useState, useEffect } from 'react'
import { Keyboard, StyleSheet, Text, View } from 'react-native'
import { useTranslation } from 'react-i18next'
import Toast from 'react-native-toast-message'
import { StackScreenProps } from '@react-navigation/stack'
import { ColorPallet, TextTheme } from '../../theme/theme'
import { TextInput, Loader } from '../../components'
import Button, { ButtonType } from '../../components/button/Button'
import { OnboardingStackParams, Screens } from '../../types/navigators'
import { ToastType } from '../../components/toast/BaseToast'
import { verifyOtp, registerUser } from './VerifyOtp.utils'

type VerifyOtpProps = StackScreenProps<OnboardingStackParams, Screens.VerifyOtp>

const style = StyleSheet.create({
  container: {
    backgroundColor: ColorPallet.grayscale.white,
    margin: 20,
    flex: 1,
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

const VerifyOtp: React.FC<VerifyOtpProps> = ({ navigation, route }) => {
  const { email, forgotPin, otpId } = route.params
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [verifyOTPId, setVerifyOTPId] = useState(otpId)
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

  const onResendOtpButtonPress = async () => {
    setResendButtonDisabledTime(RESEND_OTP_TIME_LIMIT)
    startResendOtpTimer()
    setLoading(true)
    const {
      data: { otpId },
      message,
    } = await registerUser(email, verifyOTPId)
    setLoading(false)
    setVerifyOTPId(otpId)
    Toast.show({
      type: ToastType.Success,
      text1: t('Toasts.Success'),
      text2: message,
    })
  }

  const verifyOtpSubmit = async (otpCode: string) => {
    if (otpCode.length < 6) {
      Toast.show({
        type: ToastType.Warn,
        text1: t('Toasts.Error'),
        text2: t('Global.Otp'),
      })
    } else {
      const otp = parseInt(otpCode, 10)
      setLoading(true)
      const { data, message } = await verifyOtp(verifyOTPId, otp)
      setLoading(false)
      if (data) {
        Toast.show({
          type: ToastType.Success,
          text1: t('Toasts.Success'),
          text2: message,
        })
        if (forgotPin) {
          navigation.navigate(Screens.CreatePin, { forgotPin })
        } else {
          navigation.navigate(Screens.CreatePin, { forgotPin })
        }
      } else {
        setLoading(false)
        Toast.show({
          type: ToastType.Error,
          text1: t('Toasts.Error'),
          text2: 'Invalid OTP',
        })
      }
    }
  }
  return (
    <View style={[style.container]}>
      <Loader loading={loading} />
      <TextInput
        label={t('Global.Otp')}
        placeholder={t('Global.Otp')}
        placeholderTextColor={ColorPallet.baseColors.lightGrey}
        accessible
        accessibilityLabel={t('Global.Otp')}
        maxLength={6}
        autoFocus
        keyboardType="number-pad"
        value={otp}
        onChangeText={setOtp}
        onSubmitEditing={() => {
          Keyboard.dismiss()
          verifyOtpSubmit(otp)
        }}
      />
      <Text style={[style.bodyText, style.verticalSpacer]}>
        {`${resendButtonDisabledTime} ${t('Registration.SecondCounter')}`}
      </Text>
      {resendButtonDisabledTime === 0 && (
        <Text
          style={[style.bodyText, style.verticalSpacer]}
          onPress={onResendOtpButtonPress}
        >
          {t('Registration.ResendOtp')}
        </Text>
      )}
      <Button
        title={t('Global.Verify')}
        buttonType={ButtonType.Primary}
        onPress={() => {
          Keyboard.dismiss()
          verifyOtpSubmit(otp)
        }}
      />
    </View>
  )
}

export default VerifyOtp
