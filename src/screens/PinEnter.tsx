import React, { useState, useEffect } from 'react'
import { Alert, Keyboard, SafeAreaView, StyleSheet, View } from 'react-native'
import { useTranslation } from 'react-i18next'
import ReactNativeBiometrics from 'react-native-biometrics'
import { TextInput } from '../components'
import Button, { ButtonType } from '../components/button/Button'
import { Colors } from '../theme/theme'
import { getValueKeychain } from '../utils/keychain'

interface PinEnterProps {
  setAuthenticated: React.Dispatch<React.SetStateAction<boolean>>
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

const PinEnter: React.FC<PinEnterProps> = ({ setAuthenticated }) => {
  const [pin, setPin] = useState('')
  const [biometricFailed, setBiometricFailed] = useState(false)
  const [biometricSensorAvailable, setBiometricSensorAvailable] =
    useState(false)

  useEffect(() => {
    ReactNativeBiometrics.isSensorAvailable().then(resultObject => {
      const { available, biometryType } = resultObject
      if (available && biometryType === ReactNativeBiometrics.Biometrics) {
        setBiometricSensorAvailable(true)
      } else {
        setBiometricFailed(true)
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
    }
  }

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
            }
          })
          .catch(() => {
            Alert.alert(t('Biometric.BiometricFailed'))
            setBiometricFailed(true)
          })
      } else {
        Alert.alert(t('Biometric.BiometricNotSupport'))
        setBiometricFailed(true)
      }
    })
  }

  return (
    <SafeAreaView style={[style.container]}>
      {biometricFailed && (
        <>
          <TextInput
            label={t('Global.EnterPin')}
            accessible
            accessibilityLabel={t('Global.EnterPin')}
            placeholder={t('Global.6DigitPin')}
            placeholderTextColor={Colors.lightGrey}
            autoFocus
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
        </>
      )}
      <View style={style.btnContainer}>
        {biometricSensorAvailable && !biometricFailed && (
          <Button
            title={t('Biometric.Biometric')}
            buttonType={ButtonType.Primary}
            onPress={biometricEnable}
          />
        )}
      </View>
    </SafeAreaView>
  )
}

export default PinEnter
