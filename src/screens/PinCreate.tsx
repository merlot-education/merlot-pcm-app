import React, { useState } from 'react'
import { Alert, Keyboard, StyleSheet, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import ReactNativeBiometrics from 'react-native-biometrics'
import { useTranslation } from 'react-i18next'
import md5 from 'md5'
import { setValueKeychain } from '../utils/keychain'
import { Colors } from '../theme/theme'
import { TextInput } from '../components'
import Button, { ButtonType } from '../components/button/Button'
import * as api from '../api'

interface PinCreateProps {
  setAuthenticated: React.Dispatch<React.SetStateAction<boolean>>
  initAgent: (email: string, pin: string) => void
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
}) => {
  const [pin, setPin] = useState('')
  const [pinTwo, setPinTwo] = useState('')

  const { t } = useTranslation()

  const sendSeedHash = async (userEmail: string) => {
    const genratedSeedHash = md5(userEmail)
    const seedHashResponse = await api.default.auth.sendSeedHash({
      email: userEmail,
      seedHash: genratedSeedHash,
    })
  }
  const startAgent = async (email: string, pin: string) => {
    await initAgent(email, pin)
    setAuthenticated(true)
    sendSeedHash(email)
  }

  const passcodeCreate = async (pin: string) => {
    const passcode = JSON.stringify(pin)
    const description = t('PinCreate.UserAuthenticationPin')
    try {
      setValueKeychain(description, passcode, {
        service: 'passcode',
      })

      // Change email here

      Alert.alert(t('PinCreate.PinsSuccess'), '', [
        { text: 'Ok', onPress: () => startAgent('abc@gmail.com', passcode) },
      ])
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
                setAuthenticated(true)
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
  return (
    <SafeAreaView style={[style.container]}>
      <TextInput
        label={t('Global.EnterPin')}
        placeholder={t('Global.6DigitPin')}
        placeholderTextColor={Colors.lightGrey}
        accessible
        accessibilityLabel={t('Global.EnterPin')}
        maxLength={6}
        autoFocus
        type="numeric"
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
        type="numeric"
        value={pinTwo}
        onChangeText={(text: string) => {
          setPinTwo(text)
          if (text.length === 6) {
            Keyboard.dismiss()
          }
        }}
      />
      <Button
        title={t('PinCreate.Create')}
        buttonType={ButtonType.Primary}
        onPress={() => {
          Keyboard.dismiss()
          confirmEntry(pin, pinTwo)
        }}
      />
      <View style={style.btnContainer}>
        <Button
          title={t('Biometric.Biometric')}
          buttonType={ButtonType.Primary}
          onPress={biometricEnable}
        />
      </View>
    </SafeAreaView>
  )
}

export default PinCreate
