import React, { useState, useEffect, useCallback } from 'react'
import {
  Alert,
  BackHandler,
  Keyboard,
  SafeAreaView,
  StyleSheet,
  Text,
} from 'react-native'
import { useTranslation } from 'react-i18next'
import ReactNativeBiometrics from 'react-native-biometrics'
import { StackScreenProps } from '@react-navigation/stack'
import { useFocusEffect } from '@react-navigation/native'
import { TextInput, Loader } from '../../components'
import Button, { ButtonType } from '../../components/button/Button'
import { ColorPallet, TextTheme } from '../../theme/theme'
import { OnboardingStackParams, Screens } from '../../types/navigators'
import { KeychainStorageKeys } from '../../constants'
import {
  checkIfSensorAvailable,
  removeOnboardingCompleteStage,
  createMD5HashFromString,
  getValueFromKeychain,
  showBiometricPrompt,
  registerUser,
} from './PinEnter.utils'
import { warningToast, errorToast, successToast } from '../../utils/toast'

type PinEnterProps = StackScreenProps<OnboardingStackParams, Screens.EnterPin>

const style = StyleSheet.create({
  container: {
    backgroundColor: ColorPallet.grayscale.white,
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

const PinEnter: React.FC<PinEnterProps> = ({ navigation, route }) => {
  const { initAgent, setAuthenticated } = route.params
  const [pin, setPin] = useState('')
  const [loginAttemtsFailed, setLoginAttemtsFailed] = useState(0)
  const [loading, setLoading] = useState(false)
  const { t } = useTranslation()

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        BackHandler.exitApp()
        return true
      }

      BackHandler.addEventListener('hardwareBackPress', onBackPress)

      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress)
    }, []),
  )

  const startAgent = useCallback(async () => {
    const [email, passphrase, passcode] = await Promise.all([
      new Promise(resolve => {
        resolve(getValueFromKeychain(KeychainStorageKeys.Email))
      }),
      new Promise(resolve => {
        resolve(getValueFromKeychain(KeychainStorageKeys.Passphrase))
      }),
      new Promise(resolve => {
        resolve(getValueFromKeychain(KeychainStorageKeys.Passcode))
      }),
    ])
    if (email && passphrase) {
      const rawValue = email + passphrase.password.replace(/ /g, '')
      const seedHash = createMD5HashFromString(rawValue)
      initAgent(email.password, passcode.password, seedHash)
    }
  }, [initAgent])

  const checkBiometricIfPresent = useCallback(async () => {
    const { available, biometryType } = await checkIfSensorAvailable()
    if (available && biometryType === ReactNativeBiometrics.Biometrics) {
      const { success, error } = await showBiometricPrompt()
      if (success) {
        setLoading(true)
        await startAgent()
        setLoading(false)
        setAuthenticated(true)
      } else if (error) {
        warningToast(error)
      } else {
        warningToast(t('Biometric.BiometricCancle'))
      }
    } else {
      warningToast(t('Biometric.BiometricNotSupport'))
    }
  }, [setAuthenticated, startAgent, t])

  useEffect(() => {
    checkBiometricIfPresent()
  }, [checkBiometricIfPresent])

  const checkPin = async (pin: string) => {
    const [passcode] = await Promise.all([
      new Promise(resolve => {
        resolve(getValueFromKeychain(KeychainStorageKeys.Passcode))
      }),
    ])
    if (pin === passcode.password) {
      setLoading(true)
      await startAgent()
      setAuthenticated(true)
      setLoading(false)
    } else {
      warningToast(t('PinEnter.IncorrectPin'))
      setLoginAttemtsFailed(loginAttemtsFailed + 1)
      if (loginAttemtsFailed === 5) {
        Alert.alert(t('Registration.RegisterAgain'))
        navigation.navigate(Screens.EnterPin, { forgotPin: false })
        await removeOnboardingCompleteStage()
      }
    }
  }

  const forgotPin = async () => {
    const [email] = await Promise.all([
      new Promise(resolve => {
        resolve(getValueFromKeychain(KeychainStorageKeys.Email))
      }),
    ])
    try {
      setLoading(true)
      const {
        data: { otpId },
        message,
      } = await registerUser(email.password, '')
      setLoading(false)
      successToast(message)
      navigation.navigate(Screens.VerifyOtp, {
        email: email.password,
        forgotPin: true,
        otpId,
      })
    } catch (error) {
      setLoading(false)
      errorToast(error.message)
    }
  }

  return (
    <SafeAreaView style={[style.container]}>
      <Loader loading={loading} />
      <TextInput
        label={t('Global.EnterPin')}
        accessible
        accessibilityLabel={t('Global.EnterPin')}
        placeholder={t('Global.6DigitPin')}
        placeholderTextColor={ColorPallet.baseColors.lightGrey}
        maxLength={6}
        keyboardType="numeric"
        secureTextEntry
        value={pin}
        onChangeText={(pin: string) => {
          setPin(pin.replace(/[^0-9]/g, ''))
          if (pin.length === 6) {
            Keyboard.dismiss()
          }
        }}
      />
      <Text style={[style.bodyText, style.verticalSpacer]} onPress={forgotPin}>
        {t('Global.ForgotPin')}
      </Text>
      <Button
        title={t('Global.Submit')}
        buttonType={ButtonType.Primary}
        onPress={() => {
          Keyboard.dismiss()
          checkPin(pin)
        }}
      />
    </SafeAreaView>
  )
}

export default PinEnter
