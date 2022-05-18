import React, { useState, useEffect, useCallback } from 'react'
import {
  Keyboard,
  StyleSheet,
  Text,
  View,
  Alert,
  BackHandler,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import ReactNativeBiometrics from 'react-native-biometrics'
import { useTranslation } from 'react-i18next'
import { StackScreenProps } from '@react-navigation/stack'

import { ColorPallet, TextTheme } from '../../theme/theme'
import { Loader, TextInput } from '../../components'
import Button, { ButtonType } from '../../components/button/Button'
import { KeychainStorageKeys } from '../../constants'
import { OnboardingStackParams, Screens } from '../../types/navigators'
import {
  checkIfSensorAvailable,
  createBiometricKeys,
  createMD5HashFromString,
  getValueFromKeychain,
  saveValueInKeychain,
  showBiometricPrompt,
  storeOnboardingCompleteStage,
} from './PinCreate.utils'
import { errorToast, successToast, warningToast } from '../../utils/toast'
import { getValueKeychain } from '../../utils/keychain'

type PinCreateProps = StackScreenProps<OnboardingStackParams, Screens.CreatePin>

const style = StyleSheet.create({
  container: {
    backgroundColor: ColorPallet.grayscale.white,
    margin: 20,
    flex: 1,
  },
  btnContainer: {
    marginTop: 20,
  },
  label: {
    ...TextTheme.label,
    fontWeight: 'bold',
    textAlign: 'center',
  },
})

const PinCreate: React.FC<PinCreateProps> = ({ navigation, route }) => {
  const { forgotPin } = route.params
  const [pin, setPin] = useState('')
  const [pinTwo, setPinTwo] = useState('')
  const [biometricSensorAvailable, setBiometricSensorAvailable] =
    useState(false)
  const [successPin, setSuccessPin] = useState(false)
  const [successBiometric, setSuccessBiometric] = useState(false)
  const [loading, setLoading] = useState(false)
  const { t } = useTranslation()

  const checkBiometricIfPresent = useCallback(async () => {
    const { available, biometryType } = await checkIfSensorAvailable()
    if (available && biometryType === ReactNativeBiometrics.Biometrics) {
      setBiometricSensorAvailable(true)
    }
  }, [])

  useEffect(() => {
    checkBiometricIfPresent()
  }, [checkBiometricIfPresent])

  useEffect(() => {
    const backAction = () => {
      Alert.alert(
        'Already authenticated!',
        'Are you sure you want to go back?',
        [
          {
            text: 'Cancel',
            onPress: () => null,
            style: 'cancel',
          },
          {
            text: 'YES',
            onPress: () =>
              navigation.navigate(Screens.Registration, { forgotPin: false }),
          },
        ],
      )
      return true
    }

    const backActionForgotPassword = () => {
      navigation.navigate(Screens.EnterPin)
      return true
    }
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      forgotPin ? backActionForgotPassword : backAction,
    )

    return () => backHandler.remove()
  }, [forgotPin, navigation])

  const passcodeCreate = async (passcode: string) => {
    try {
      const [email, passphrase] = await Promise.all([
        new Promise(resolve => {
          resolve(getValueFromKeychain(KeychainStorageKeys.Email))
        }),
        new Promise(resolve => {
          resolve(getValueFromKeychain(KeychainStorageKeys.Passphrase))
        }),
        new Promise(resolve => {
          resolve(
            saveValueInKeychain(
              KeychainStorageKeys.Passcode,
              passcode,
              t('PinCreate.UserAuthenticationPin'),
            ),
          )
        }),
      ])
      setSuccessPin(true)
      if (forgotPin) {
        navigation.navigate(Screens.EnterPin)
      }
      successToast(t('PinCreate.PinsSuccess'))
    } catch (e) {
      errorToast(e)
    }
  }

  const confirmEntry = async (pin: string, reEnterPin: string) => {
    if (pin.length < 6) {
      warningToast(t('PinCreate.PinMustBe6DigitsInLength'))
    } else if (reEnterPin.length < 6) {
      errorToast(t('PinCreate.ReEnterPinMustBe6DigitsInLength'))
    } else if (pin !== reEnterPin) {
      errorToast(t('PinCreate.PinsEnteredDoNotMatch'))
    } else {
      await passcodeCreate(pin)
    }
  }

  const biometricEnable = async () => {
    const { available, biometryType } = await checkIfSensorAvailable()
    if (available && biometryType === ReactNativeBiometrics.Biometrics) {
      const { success, error } = await showBiometricPrompt()
      if (success) {
        await createBiometricKeys()
        setSuccessBiometric(true)
        successToast(t('Biometric.BiometricSuccess'))
      } else {
        warningToast(error)
      }
    } else {
      warningToast(t('Biometric.BiometricNotSupport'))
    }
  }

  const onSubmit = async () => {
    if (successPin && successBiometric) {
      navigation.navigate(Screens.CreateWallet)
    } else if (successPin && !biometricSensorAvailable) {
      navigation.navigate(Screens.CreateWallet)
    } else {
      warningToast(t('PinCreate.RegisterPinandBiometric'))
    }
  }
  const showSameEmailAlert = () => {
    Alert.alert(t('PinCreate.EmailConfirmation'), t('PinCreate.CheckEmail'), [
      {
        text: t('Global.ChangeEmail'),
        style: 'cancel',
        onPress: () =>
          navigation.navigate(Screens.Registration, { forgotPin: false }),
      },
      { text: t('Global.Next'), onPress: proceedToImport },
    ])
  }

  const proceedToImport = () => {
    if (successPin && successBiometric) {
      navigation.navigate(Screens.ImportWallet)
    } else if (successPin && !biometricSensorAvailable) {
      navigation.navigate(Screens.ImportWallet)
    } else {
      warningToast(t('PinCreate.RegisterPinandBiometric'))
    }
  }

  const onImportWallet = () => {
    showSameEmailAlert()
  }

  return (
    <SafeAreaView style={[style.container]}>
      <Loader loading={loading} />
      <TextInput
        label={t('Global.EnterPin')}
        placeholder={t('Global.6DigitPin')}
        placeholderTextColor={ColorPallet.baseColors.lightGrey}
        accessible
        accessibilityLabel={t('Global.EnterPin')}
        maxLength={6}
        autoFocus
        secureTextEntry
        keyboardType="number-pad"
        value={pin}
        onChangeText={setPin}
      />
      <TextInput
        label={t('PinCreate.ReenterPin')}
        accessible
        accessibilityLabel={t('PinCreate.ReenterPin')}
        placeholder={t('Global.6DigitPin')}
        placeholderTextColor={ColorPallet.baseColors.lightGrey}
        maxLength={6}
        secureTextEntry
        keyboardType="number-pad"
        value={pinTwo}
        onChangeText={(text: string) => {
          setPinTwo(text)
          if (text.length === 6) {
            Keyboard.dismiss()
          }
        }}
        editable={pin.length === 6 && true}
      />
      <View style={style.btnContainer}>
        <Button
          title="Setup PIN"
          buttonType={ButtonType.Primary}
          disabled={successPin}
          onPress={() => {
            Keyboard.dismiss()
            confirmEntry(pin, pinTwo)
          }}
        />
      </View>
      {!forgotPin && (
        <>
          <View style={style.btnContainer}>
            {biometricSensorAvailable && (
              <Button
                title="Setup Biometric"
                buttonType={ButtonType.Primary}
                onPress={biometricEnable}
                disabled={successBiometric}
              />
            )}
          </View>
          <View style={style.btnContainer}>
            <Button
              title="Import Wallet"
              buttonType={ButtonType.Primary}
              onPress={onImportWallet}
            />
          </View>
          <View style={style.btnContainer}>
            <Text style={style.label}> {t('PinCreate.OR')}</Text>
          </View>
          <View style={style.btnContainer}>
            <Button
              title="Create Wallet"
              buttonType={ButtonType.Primary}
              onPress={onSubmit}
            />
          </View>
        </>
      )}
    </SafeAreaView>
  )
}

export default PinCreate
