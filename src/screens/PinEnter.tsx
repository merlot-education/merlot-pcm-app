import React, { useState, useEffect, useCallback } from 'react'
import { Alert, Keyboard, SafeAreaView, StyleSheet, Text } from 'react-native'
import { useTranslation } from 'react-i18next'
import ReactNativeBiometrics from 'react-native-biometrics'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { StackScreenProps } from '@react-navigation/stack'
import md5 from 'md5'
import { TextInput, Loader } from '../components'
import Button, { ButtonType } from '../components/button/Button'
import { Colors, TextTheme } from '../theme/theme'
import { getValueKeychain } from '../utils/keychain'
import { OnboardingStackParams, Screens } from '../types/navigators'
import { LocalStorageKeys } from '../constants'

type PinEnterProps = StackScreenProps<OnboardingStackParams, Screens.EnterPin>

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

const PinEnter: React.FC<PinEnterProps> = ({ navigation, route }) => {
  const { initAgent, setAuthenticated } = route.params
  const [pin, setPin] = useState('')
  const [loginAttemtsFailed, setLoginAttemtsFailed] = useState(0)
  const [biometricFailed, setBiometricFailed] = useState(false)
  const [loading, setLoading] = useState(false)
  const { t } = useTranslation()

  const startAgent = useCallback(async () => {
    const email = await getValueKeychain({
      service: 'email',
    })
    const passphrase = await getValueKeychain({
      service: 'passphrase',
    })
    const pinCode = await getValueKeychain({
      service: 'passcode',
    })
    if (email && passphrase) {
      const hash = email + passphrase.password.replace(/ /g, '')
      const seedHash = String(md5(hash))
      initAgent(email.password, pinCode.password, seedHash)
    }
  }, [initAgent])

  const biometricEnable = useCallback(() => {
    ReactNativeBiometrics.isSensorAvailable().then(resultObject => {
      const { available, biometryType } = resultObject
      if (available && biometryType === ReactNativeBiometrics.Biometrics) {
        ReactNativeBiometrics.simplePrompt({
          promptMessage: t('Biometric.BiometricConfirm'),
        })
          .then(async resultObject => {
            const { success } = resultObject
            if (success) {
              setLoading(true)
              await startAgent()
              setLoading(false)
              setAuthenticated(true)
            } else {
              Alert.alert(t('Biometric.BiometricCancle'))
              setBiometricFailed(true)
            }
          })
          .catch(() => {
            Alert.alert(t('Biometric.BiometricFailed'))
            setBiometricFailed(true)
          })
      } else {
        Alert.alert(t('Biometric.BiometricNotSupport'))
      }
    })
  }, [setAuthenticated, startAgent, t])

  useEffect(() => {
    ReactNativeBiometrics.isSensorAvailable().then(resultObject => {
      const { available, biometryType } = resultObject
      if (
        available &&
        biometryType === ReactNativeBiometrics.Biometrics &&
        !biometricFailed
      ) {
        biometricEnable()
      }
    })
  }, [biometricEnable, biometricFailed])

  const checkPin = async (pin: string) => {
    const keychainEntry = await getValueKeychain({
      service: 'passcode',
    })
    if (keychainEntry && pin === keychainEntry.password) {
      setLoading(true)
      await startAgent()
      setAuthenticated(true)
      setLoading(false)
    } else {
      Alert.alert(t('PinEnter.IncorrectPin'))
      setLoginAttemtsFailed(loginAttemtsFailed + 1)
      if (loginAttemtsFailed === 5) {
        Alert.alert(t('Registration.RegisterAgain'))
        navigation.navigate(Screens.Registration, { forgotPin: false })
        await AsyncStorage.removeItem(LocalStorageKeys.OnboardingCompleteStage)
      }
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
        placeholderTextColor={Colors.lightGrey}
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
      <Text
        style={[style.bodyText, style.verticalSpacer]}
        onPress={() =>
          navigation.navigate(Screens.Registration, { forgotPin: true })
        }
      >
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
