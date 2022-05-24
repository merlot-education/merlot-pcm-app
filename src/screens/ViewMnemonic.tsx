import React, { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Alert, Keyboard, StyleSheet, Text, View } from 'react-native'
import ReactNativeBiometrics from 'react-native-biometrics'
import Toast from 'react-native-toast-message'
import Clipboard from '@react-native-clipboard/clipboard'
import { TextInput } from '../components'
import Button, { ButtonType } from '../components/button/Button'
import { ToastType } from '../components/toast/BaseToast'
import { KeychainStorageKeys } from '../constants'
import { ColorPallet, TextTheme } from '../theme/theme'
import { getValueKeychain } from '../utils/keychain'

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
  subContainer: {
    backgroundColor: ColorPallet.grayscale.white,
    flex: 1,
    margin: 20,
  },
  boxContainer: {
    backgroundColor: ColorPallet.notification.info,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: ColorPallet.notification.infoBorder,
    padding: 10,
    marginTop: 10,
    marginBottom: 20,
  },
  label: {
    ...TextTheme.normal,
    fontWeight: 'bold',
  },
  headerText: {
    ...TextTheme.normal,
    color: ColorPallet.notification.infoText,
    flexShrink: 1,
  },
})

const ViewMnemonic: React.FC = () => {
  const [pin, setPin] = useState('')
  const [loginAttemtsFailed, setLoginAttemtsFailed] = useState(0)
  const [biometricFailed, setBiometricFailed] = useState(false)
  const [showMnemonicView, setMnemonicView] = useState(false)
  const [mnemonicText, setMnemonic] = useState('')
  const { t } = useTranslation()

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
              showMnemonic()

              //   setAuthenticated(true)
            } else {
              Toast.show({
                type: ToastType.Warn,
                text1: t('Toasts.Warning'),
                text2: t('Biometric.BiometricCancle'),
              })
              setBiometricFailed(true)
            }
          })
          .catch(() => {
            Toast.show({
              type: ToastType.Error,
              text1: t('Toasts.Warning'),
              text2: t('Biometric.BiometricFailed'),
            })
            setBiometricFailed(true)
          })
      } else {
        Toast.show({
          type: ToastType.Warn,
          text1: t('Toasts.Warning'),
          text2: t('Biometric.BiometricNotSupport'),
        })
      }
    })
  }, [t])

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
      showMnemonic()
    } else {
      Toast.show({
        type: ToastType.Warn,
        text1: t('Toasts.Warning'),
        text2: t('PinEnter.IncorrectPin'),
      })
      setLoginAttemtsFailed(loginAttemtsFailed + 1)
      if (loginAttemtsFailed === 5) {
        Alert.alert(t('Registration.RegisterAgain'))
        // navigation.navigate(Screens.Registration, { forgotPin: false })
        // await AsyncStorage.removeItem(LocalStorageKeys.OnboardingCompleteStage)
      }
    }
  }

  const showMnemonic = async () => {
    const passphraseEntry = await getValueKeychain({
      service: KeychainStorageKeys.Passphrase,
    })
    setMnemonic(passphraseEntry.password)
    setMnemonicView(true)
  }

  const copyMnemonic = async () => {
    Clipboard.setString(mnemonicText)
    const description = t('Registration.MnemonicMsg')
  }

  return (
    <View style={[style.container]}>
      {!showMnemonicView && (
        <>
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
      {showMnemonicView && (
        <>
          <Text style={style.label}>Mnemonic</Text>
          <View style={style.boxContainer}>
            <Text style={style.headerText}>{mnemonicText}</Text>
            <Text style={style.bodyText}>{t('Registration.MnemonicMsg')}</Text>
            <Button
              title={t('Global.Copy')}
              buttonType={ButtonType.Primary}
              onPress={copyMnemonic}
            />
          </View>
        </>
      )}
    </View>
  )
}
export default ViewMnemonic
