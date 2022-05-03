import { t } from 'i18next'
import React, { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Alert,
  Keyboard,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import ReactNativeBiometrics from 'react-native-biometrics'
import Toast from 'react-native-toast-message'
import Clipboard from '@react-native-clipboard/clipboard'
import { Loader, TextInput } from '../../components'
import Button, { ButtonType } from '../../components/button/Button'
import { ToastType } from '../../components/toast/BaseToast'
import { KeychainStorageKeys } from '../../constants'
import { ColorPallet, TextTheme } from '../../theme/theme'
import { getValueKeychain } from '../../utils/keychain'
import {
  authenticateUser,
  checkIfSensorAvailable,
  getMnemonicFromKeychain,
  getValueFromKeychain,
  showBiometricPrompt,
} from './ViewMnemonic.utils'
import { warningToast } from '../../utils/toast'

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
  const [showMnemonicView, setMnemonicView] = useState(false)
  const [mnemonicText, setMnemonic] = useState('')
  const [loading, setLoading] = useState(false)
  const { t } = useTranslation()

  const checkBiometricIfPresent = useCallback(async () => {
    const { available, biometryType } = await checkIfSensorAvailable()
    if (available && biometryType === ReactNativeBiometrics.Biometrics) {
      const { success, error } = await showBiometricPrompt()
      if (success) {
        setLoading(true)
        showMnemonic()
        setLoading(false)
      } else if (error) {
        warningToast(error)
      } else {
        warningToast(t('Biometric.BiometricCancle'))
      }
    } else {
      warningToast(t('Biometric.BiometricNotSupport'))
    }
  }, [t])

  useEffect(() => {
    checkBiometricIfPresent()
  }, [checkBiometricIfPresent])

  const checkPin = async (pin: string) => {
    const [passcode] = await Promise.all([
      new Promise(resolve => {
        resolve(getValueFromKeychain(KeychainStorageKeys.Passcode))
      }),
    ])
    const params = [pin, passcode.password]
    const result = authenticateUser(params)
    if (result) {
      showMnemonic()
    } else {
      warningToast(t('PinEnter.IncorrectPin'))
    }
  }

  const showMnemonic = async () => {
    const [passphraseEntry] = await Promise.all([
      new Promise(resolve => {
        resolve(getMnemonicFromKeychain())
      }),
    ])
    setMnemonic(passphraseEntry.password)
    setMnemonicView(true)
  }
  const copyMnemonic = async () => {
    Clipboard.setString(mnemonicText)
    const description = t('Registration.MnemonicMsg')
  }
  return (
    <SafeAreaView style={[style.container]}>
      <Loader loading={loading} />
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
    </SafeAreaView>
  )
}
export default ViewMnemonic
