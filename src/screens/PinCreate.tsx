import React, { useState } from 'react'
import { Alert, Keyboard, StyleSheet, View } from 'react-native'
import * as Keychain from 'react-native-keychain'
import { SafeAreaView } from 'react-native-safe-area-context'
import ReactNativeBiometrics from 'react-native-biometrics'
import { useTranslation } from 'react-i18next'
import { setValueKeychain } from '../utils/keychain'
import { Colors } from '../theme/theme'
import { TextInput } from '../components'
import Button, { ButtonType } from '../components/button/Button'

interface PinCreateProps {
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

const PinCreate: React.FC<PinCreateProps> = ({ setAuthenticated }) => {
  const [pin, setPin] = useState('')
  const [pinTwo, setPinTwo] = useState('')

  const { t } = useTranslation()

  const passcodeCreate = async (pin: string) => {
    const passcode = JSON.stringify(pin)
    const description = t('PinCreate.UserAuthenticationPin')
    try {
      // await Keychain.setGenericPassword(description, passcode, {
      //   service: 'passcode',
      // })
      setValueKeychain(description, passcode, {
        service: 'passcode',
      })
      Alert.alert(t('PinCreate.PinsSuccess'))
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
      setAuthenticated(true)
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
        keyboardType="numeric"
        secureTextEntry
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
        keyboardType="numeric"
        secureTextEntry
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
