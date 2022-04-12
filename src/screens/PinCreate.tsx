import React, { useState, useEffect } from 'react'
import { Keyboard, StyleSheet, View, Alert, BackHandler } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import ReactNativeBiometrics from 'react-native-biometrics'
import { useTranslation } from 'react-i18next'
import AsyncStorage from '@react-native-async-storage/async-storage'
import md5 from 'md5'
import Toast from 'react-native-toast-message'
import { StackScreenProps } from '@react-navigation/stack'

import { getValueKeychain, setValueKeychain } from '../utils/keychain'
import { ColorPallet } from '../theme/theme'
import { Loader, TextInput } from '../components'
import Button, { ButtonType } from '../components/button/Button'
import { KeychainStorageKeys, LocalStorageKeys } from '../constants'
import { OnboardingStackParams, Screens } from '../types/navigators'
import { ToastType } from '../components/toast/BaseToast'

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
})

const PinCreate: React.FC<PinCreateProps> = ({ navigation, route }) => {
  const { initAgent, forgotPin } = route.params
  const [pin, setPin] = useState('')
  const [pinTwo, setPinTwo] = useState('')
  const [biometricSensorAvailable, setBiometricSensorAvailable] =
    useState(false)
  const [successPin, setSuccessPin] = useState(false)
  const [successBiometric, setSuccessBiometric] = useState(false)
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [passphrase, setPassphrase] = useState('')
  const { t } = useTranslation()

  const startAgent = async (email: string, pin: string) => {
    try {
      const hash = email + passphrase.replace(/ /g, '')
      const seedHash = String(md5(hash))
      setLoading(true)
      await initAgent(email, pin, seedHash)
      await storeOnboardingCompleteStage()
      setLoading(false)
      Toast.show({
        type: ToastType.Success,
        text1: t('Toasts.Success'),
        text2: t('PinCreate.WalletCreated'),
      })
      navigation.navigate(Screens.DefaultConnection)
    } catch (error) {
      setLoading(false)
      Toast.show({
        type: ToastType.Error,
        text1: t('Toasts.Error'),
        text2: error.message,
      })
    }
  }
  const storeOnboardingCompleteStage = async () => {
    await AsyncStorage.setItem(LocalStorageKeys.OnboardingCompleteStage, 'true')
  }

  useEffect(() => {
    ReactNativeBiometrics.isSensorAvailable().then(resultObject => {
      const { available, biometryType } = resultObject
      if (available && biometryType === ReactNativeBiometrics.Biometrics) {
        setBiometricSensorAvailable(true)
      }
    })
  })

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

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    )

    return () => backHandler.remove()
  }, [navigation])

  const passcodeCreate = async (passcode: string) => {
    const description = t('PinCreate.UserAuthenticationPin')
    try {
      setValueKeychain(description, passcode, {
        service: 'passcode',
      })

      // Change email here
      const emailEntry = await getValueKeychain({
        service: KeychainStorageKeys.Email,
      })
      const passphraseEntry = await getValueKeychain({
        service: KeychainStorageKeys.Passphrase,
      })
      if (emailEntry && passphraseEntry) {
        setEmail(emailEntry.password)
        setPassphrase(passphraseEntry.password)
      }
      setSuccessPin(true)
      Toast.show({
        type: ToastType.Success,
        text1: t('Toasts.Success'),
        text2: t('PinCreate.PinsSuccess'),
      })
    } catch (e) {
      Toast.show({
        type: ToastType.Error,
        text1: t('Toasts.Error'),
        text2: e,
      })
    }
  }

  const confirmEntry = (pin: string, reEnterPin: string) => {
    if (pin.length < 6) {
      Toast.show({
        type: ToastType.Warn,
        text1: t('Toasts.Warning'),
        text2: t('PinCreate.PinMustBe6DigitsInLength'),
      })
    } else if (reEnterPin.length < 6) {
      Toast.show({
        type: ToastType.Error,
        text1: t('Toasts.Error'),
        text2: t('PinCreate.ReEnterPinMustBe6DigitsInLength'),
      })
    } else if (pin !== reEnterPin) {
      Toast.show({
        type: ToastType.Error,
        text1: t('Toasts.Error'),
        text2: t('PinCreate.PinsEnteredDoNotMatch'),
      })
    } else {
      passcodeCreate(pin)
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
              ReactNativeBiometrics.createKeys().then(() => {
                setSuccessBiometric(true)
                Toast.show({
                  type: ToastType.Success,
                  text1: t('Toasts.Success'),
                  text2: t('Biometric.BiometricSuccess'),
                })
              })
            } else {
              Toast.show({
                type: ToastType.Warn,
                text1: t('Toasts.Warning'),
                text2: t('Biometric.BiometricCancle'),
              })
            }
          })
          .catch(() => {
            Toast.show({
              type: ToastType.Error,
              text1: t('Toasts.Error'),
              text2: t('Biometric.BiometricFailed'),
            })
          })
      } else {
        Toast.show({
          type: ToastType.Warn,
          text1: t('Toasts.Warning'),
          text2: t('Biometric.BiometricNotSupport'),
        })
      }
    })
  }
  const onSubmit = async () => {
    if (successPin && successBiometric) {
      await startAgent(email, pin)
    } else if (successPin && !biometricSensorAvailable) {
      await startAgent(email, pin)
    } else {
      Toast.show({
        type: ToastType.Warn,
        text1: t('Toasts.Warning'),
        text2: t('Biometric.RegisterPinandBiometric'),
      })
    }
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
      <Button
        title="Setup PIN"
        buttonType={ButtonType.Primary}
        disabled={successPin}
        onPress={() => {
          Keyboard.dismiss()
          confirmEntry(pin, pinTwo)
        }}
      />
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
              onPress={() => navigation.navigate(Screens.ImportWallet)}
            />
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
