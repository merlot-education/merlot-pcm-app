import React, { useState } from 'react'
import { Alert, Keyboard, SafeAreaView, StyleSheet } from 'react-native'
import * as Keychain from 'react-native-keychain'

import { TextInput } from '../components'
import Button, { ButtonType } from '../components/button/Button'
import { Colors } from '../theme/theme'

interface PinEnterProps {
  setAuthenticated: React.Dispatch<React.SetStateAction<boolean>>
}

const style = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    margin: 20,
  },
})

const PinEnter: React.FC<PinEnterProps> = ({ setAuthenticated }) => {
  const [pin, setPin] = useState('')

  const checkPin = async (pin: string) => {
    const keychainEntry = await Keychain.getGenericPassword({
      service: 'passcode',
    })
    if (keychainEntry && JSON.stringify(pin) === keychainEntry.password) {
      setAuthenticated(true)
    } else {
      Alert.alert('Incorrect Pin')
    }
  }

  return (
    <SafeAreaView style={[style.container]}>
      <TextInput
        label="Enter Pin"
        accessible
        accessibilityLabel="Enter Pin"
        placeholder="6 Digit Pin"
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
        title="Submit"
        buttonType={ButtonType.Primary}
        accessibilityLabel="Submit"
        onPress={() => {
          Keyboard.dismiss()
          checkPin(pin)
        }}
      />
    </SafeAreaView>
  )
}

export default PinEnter
