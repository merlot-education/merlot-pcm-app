import React, { useState } from 'react'
import { Alert, Keyboard, SafeAreaView, StyleSheet } from 'react-native'
import { useTranslation } from 'react-i18next'
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
})

const PinEnter: React.FC<PinEnterProps> = ({ setAuthenticated }) => {
  const [pin, setPin] = useState('')
  const { t } = useTranslation()

  const checkPin = async (pin: string) => {
    const keychainEntry = await getValueKeychain({
      service: 'passcode',
    })
    if (keychainEntry && JSON.stringify(pin) === keychainEntry.password) {
      setAuthenticated(true)
    } else {
      Alert.alert(t('PinEnter.IncorrectPin'))
    }
  }

  return (
    <SafeAreaView style={[style.container]}>
      <TextInput
        label={t('Global.EnterPin')}
        accessible
        accessibilityLabel={t('Global.EnterPin')}
        placeholder={t('Global.6DigitPin')}
        placeholderTextColor={Colors.lightGrey}
        autoFocus
        maxLength={6}
        type="numeric"
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
    </SafeAreaView>
  )
}

export default PinEnter
