import React, { useState, useEffect } from 'react'
import { Alert, Keyboard, SafeAreaView, StyleSheet, View } from 'react-native'
import { useTranslation } from 'react-i18next'
import ReactNativeBiometrics from 'react-native-biometrics'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { TextInput } from '../components'
import Button, { ButtonType } from '../components/button/Button'
import { Colors } from '../theme/theme'
import { getValueKeychain } from '../utils/keychain'
import { LocalStorageKeys } from '../constants'
import { Screens } from '../types/navigators'

interface PinEnterProps {
  setAuthenticated: React.Dispatch<React.SetStateAction<boolean>>
  navigation: any
}

const style = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    margin: 20,
  },
  btnContainer: {
    marginTop: 20,
  },
})

const PinEnter: React.FC<PinEnterProps> = ({
  setAuthenticated,
  navigation,
}) => {
  const [pin, setPin] = useState('')
  const [loginAttemtsFailed, setLoginAttemtsFailed] = useState(0)
  const [biometricFailed, setBiometricFailed] = useState(false)

  const biometricEnable = () => {
    ReactNativeBiometrics.isSensorAvailable().then(resultObject => {
      const { available, biometryType } = resultObject
      if (available && biometryType === ReactNativeBiometrics.Biometrics) {
        ReactNativeBiometrics.simplePrompt({
          promptMessage: t('Biometric.BiometricConfirm'),
        })
          .then(resultObject => {
            const { success } = resultObject
            if (success) {
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
  }

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
  })

  const { t } = useTranslation()
  const checkPin = async (pin: string) => {
    const keychainEntry = await getValueKeychain({
      service: 'passcode',
    })
    if (keychainEntry && pin === keychainEntry.password) {
      setAuthenticated(true)
    } else {
      Alert.alert(t('PinEnter.IncorrectPin'))
      setLoginAttemtsFailed(loginAttemtsFailed + 1)
      if (loginAttemtsFailed === 5) {
        Alert.alert(t('Registration.RegisterAgain'))
        navigation.navigate(Screens.Registration)
        await AsyncStorage.removeItem(LocalStorageKeys.StackManage)
      }
    }
  }

  return (
    <SafeAreaView style={[style.container]}>
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
