import React, { useState, useEffect } from 'react'
import { Alert, Keyboard, StyleSheet, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import ReactNativeBiometrics from 'react-native-biometrics'
import { useTranslation } from 'react-i18next'
import md5 from 'md5'
import { getValueKeychain, setValueKeychain } from '../utils/keychain'
import { Colors } from '../theme/theme'
import { Loader, TextInput } from '../components'
import Button, { ButtonType } from '../components/button/Button'
import * as api from '../api'

interface PinCreateProps {
  setAuthenticated: React.Dispatch<React.SetStateAction<boolean>>
  initAgent: (email: string, pin: string) => void
  route
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

const PinCreate: React.FC<PinCreateProps> = ({
  setAuthenticated,
  initAgent,
  route,
}) => {
  const [pin, setPin] = useState('')
  const [pinTwo, setPinTwo] = useState('')
  const [biometricSensorAvailable, setBiometricSensorAvailable] =
    useState(false)
  const [successPin, setSuccessPin] = useState(false)
  const [successBiometric, setSuccessBiometric] = useState(false)
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const { forgotPin } = route.params
  const { t } = useTranslation()

  const sendSeedHash = async (userEmail: string) => {
    const genratedSeedHash = md5(userEmail)
    const seedHashResponse = await api.default.auth.sendSeedHash({
      email: userEmail,
      seedHash: genratedSeedHash,
    })
    if (seedHashResponse.data != null) {
      // seed sent via email
    }
  }
  const startAgent = async (email: string, pin: string) => {
    setLoading(true)
    await initAgent(email, pin)
    await sendSeedHash(email)
    // setTimeout(() => {
    setLoading(false)
    setAuthenticated(true)
    // }, 10000)
  }
  useEffect(() => {
    ReactNativeBiometrics.isSensorAvailable().then(resultObject => {
      const { available, biometryType } = resultObject
      if (available && biometryType === ReactNativeBiometrics.Biometrics) {
        setBiometricSensorAvailable(true)
      }
    })
  })

  const passcodeCreate = async (passcode: string) => {
    const description = t('PinCreate.UserAuthenticationPin')
    try {
      setValueKeychain(description, passcode, {
        service: 'passcode',
      })

      // Change email here
      const keychainEntry = await getValueKeychain({
        service: 'email',
      })
      setEmail(keychainEntry.password)
      Alert.alert(t('PinCreate.PinsSuccess'), '', [
        {
          text: 'Ok',
          // onPress: () =>
          //   startAgent(JSON.parse(keychainEntry).password, passcode),
        },
      ])
      setSuccessPin(true)
    } catch (e) {
      Alert.alert(e)
    }
  }

  const confirmEntry = (x: string, y: string) => {
    if (x.length < 6 || y.length < 6) {
      Alert.alert(t('PinCreate.PinMustBe6DigitsInLength'))
    } else if (x !== y) {
      Alert.alert(t('PinCreate.PinsEnteredDoNotMatch'))
    } else {
      passcodeCreate(x)
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
                Alert.alert(t('Biometric.BiometricSuccess'))
              })
            } else {
              Alert.alert(t('Biometric.BiometricCancle'))
            }
          })
          .catch(() => {
            Alert.alert(t('Biometric.BiometricFailed'))
          })
      } else {
        Alert.alert(t('Biometric.BiometricNotSupport'))
      }
    })
  }

  const onSubmit = async () => {
    if (successPin && successBiometric) {
      // setAuthenticated(true)
      await startAgent(email, pin)
    } else if (successPin && !biometricSensorAvailable) {
      setAuthenticated(true)
    } else {
      Alert.alert(t('Biometric.RegisterPinandBiometric'))
    }
  }
  return (
    <SafeAreaView style={[style.container]}>
      <Loader loading={loading} />
      <TextInput
        label={t('Global.EnterPin')}
        placeholder={t('Global.6DigitPin')}
        placeholderTextColor={Colors.lightGrey}
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
        placeholderTextColor={Colors.lightGrey}
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
      />
      <Button
        title="Setup PIN"
        buttonType={ButtonType.Primary}
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
              />
            )}
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
