import React, { useState } from 'react'
import { Alert, Keyboard, StyleSheet, View } from 'react-native'
import * as Keychain from 'react-native-keychain'
import { SafeAreaView } from 'react-native-safe-area-context'
import ReactNativeBiometrics from 'react-native-biometrics'

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

  const passcodeCreate = async (pin: string) => {
    const passcode = JSON.stringify(pin)
    const description = 'User authentication pin'
    try {
      await Keychain.setGenericPassword(description, passcode, {
        service: 'passcode',
      })
      Alert.alert('Pin created successfully')
    } catch (e) {
      Alert.alert(e)
    }
  }

  const confirmEntry = (x: string, y: string) => {
    if (x.length < 6 || y.length < 6) {
      Alert.alert('Pin must be 6 digits in length')
    } else if (x !== y) {
      Alert.alert('Pin entered do not match')
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
          promptMessage: 'Confirm fingerprint',
        })
          .then(resultObject => {
            const { success } = resultObject

            if (success) {
              ReactNativeBiometrics.createKeys().then(() => {
                setAuthenticated(true)
                Alert.alert('fingerprint register successfully ')
              })
            } else {
              Alert.alert('User cancelled biometric prompt')
            }
          })
          .catch(() => {
            Alert.alert('Biometrics failed')
          })
      } else {
        Alert.alert('Biometrics not supported')
      }
    })
  }
  return (
    <SafeAreaView style={[style.container]}>
      <TextInput
        label="Enter Pin"
        placeholder="6 Digit Pin"
        placeholderTextColor={Colors.lightGrey}
        accessible
        accessibilityLabel="Enter Pin"
        maxLength={6}
        autoFocus
        keyboardType="numeric"
        secureTextEntry
        value={pin}
        onChangeText={setPin}
      />
      <TextInput
        label="Re-Enter Pin"
        accessible
        accessibilityLabel="Re-Enter Pin"
        placeholder="6 Digit Pin"
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
        title="Create"
        accessibilityLabel="Create"
        buttonType={ButtonType.Primary}
        onPress={() => {
          Keyboard.dismiss()
          confirmEntry(pin, pinTwo)
        }}
      />
      <View style={style.btnContainer}>
        <Button
          title="Biometric"
          accessibilityLabel="Biometric"
          buttonType={ButtonType.Primary}
          onPress={biometricEnable}
        />
      </View>
    </SafeAreaView>
  )
}

export default PinCreate
