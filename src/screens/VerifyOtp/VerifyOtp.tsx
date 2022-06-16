import React, { useState, useEffect, useCallback } from 'react'
import { Keyboard, StyleSheet, Text, View, Image } from 'react-native'
import { useTranslation } from 'react-i18next'
import { StackScreenProps } from '@react-navigation/stack'
import { ColorPallet, TextTheme } from '../../theme/theme'
import {
  TextInput,
  Loader,
  InfoCard,
  ScreenNavigatorButtons,
} from '../../components'
import { OnboardingStackParams, Screens } from '../../types/navigators'
import { verifyOtp, registerUser } from './VerifyOtp.utils'
import Images from '../../assets'

type VerifyOtpProps = StackScreenProps<OnboardingStackParams, Screens.VerifyOtp>

const style = StyleSheet.create({
  container: {
    backgroundColor: ColorPallet.grayscale.white,
    margin: 20,
    flex: 1,
    justifyContent: 'space-between',
  },
  bodyText: {
    ...TextTheme.normal,
    flexShrink: 1,
  },
  verticalSpacer: {
    textAlign: 'center',
  },
  emailImg: {
    height: 95,
    width: 95,
    alignSelf: 'center',
  },
})

const RESEND_OTP_TIME_LIMIT = 60 // 60 secs

let resendOtpTimerInterval

const VerifyOtp: React.FC<VerifyOtpProps> = ({ navigation, route }) => {
  const { email, forgotPin, otpId } = route.params
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [verifyOTPId, setVerifyOTPId] = useState(otpId)
  const [otpCorrect, setOtpCorrect] = useState(false)
  const [otpWrong, setOtpWrong] = useState(false)
  const [error, setError] = useState(false)

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

  const verifyOtpSubmit = useCallback(
    async (otpCode: string) => {
      const otp = parseInt(otpCode, 10)
      setLoading(true)
      const { data } = await verifyOtp(verifyOTPId, otp)
      setLoading(false)
      if (data) {
        setOtpCorrect(true)
        setOtpWrong(false)
        setError(t('Registration.OtpSuccess'))
      } else {
        setLoading(false)
        setOtpWrong(true)
        setOtpCorrect(false)
        setError(t('Registration.OtpInvalid'))
      }
    },
    [t, verifyOTPId],
  )

  useEffect(() => {
    if (otp.length === 6) {
      verifyOtpSubmit(otp)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otp.length === 6, verifyOtpSubmit])

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
    setError(message)
  }

  const onBack = async () => {
    navigation.navigate(Screens.Registration)
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
      {otpWrong && (
        <Image source={Images.wrongOtpIcon} style={style.emailImg} />
      )}
      {otpCorrect && (
        <Image source={Images.correctOtpIcon} style={style.emailImg} />
      )}
      <View>
        <InfoCard showBottomIcon={false} showTopIcon errorMsg={error}>
          {t('Registration.OtpInfo')}
        </InfoCard>
      </View>
      <ScreenNavigatorButtons
        onLeftPress={onBack}
        onRightPress={() => {
          navigation.navigate(Screens.CreatePin, { forgotPin })
        }}
        isRightDisabled={!otpCorrect}
      />
    </View>
  )
}

export default VerifyOtp
