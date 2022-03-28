import React, { useState } from 'react'
import { Alert, Keyboard, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'
import { StackScreenProps } from '@react-navigation/stack'
import { getValueKeychain, setValueKeychain } from '../utils/keychain'
import { Colors } from '../theme/theme'
import { TextInput } from '../components'
import Button, { ButtonType } from '../components/button/Button'
import { Screens, SettingStackParams } from '../types/navigators'

type ChangePinProps = StackScreenProps<SettingStackParams, Screens.ChangePin>

const style = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    margin: 20,
  },
})

const ChangePin: React.FC<ChangePinProps> = () => {
  const [pin, setPin] = useState('')
  const [pinTwo, setPinTwo] = useState('')
  const [pinThree, setPinThree] = useState('')
  const { t } = useTranslation()

  const passcodeCreate = async (passcode: string) => {
    const description = t('PinCreate.UserAuthenticationPin')
    try {
      setValueKeychain(description, passcode, {
        service: 'passcode',
      })

      Alert.alert(t('PinCreate.PinsSuccess'), '', [
        {
          text: 'Ok',
        },
      ])
    } catch (e) {
      Alert.alert(e)
    }
  }

  const confirmEntry = async (
    oldPin: string,
    newPin: string,
    reEnterNewPin: string,
  ) => {
    const keychainEntry = await getValueKeychain({
      service: 'passcode',
    })
    if (oldPin.length < 6 || newPin.length < 6) {
      Alert.alert(t('PinCreate.PinMustBe6DigitsInLength'))
    } else if (newPin !== reEnterNewPin) {
      Alert.alert(t('PinCreate.PinsEnteredDoNotMatch'))
    } else if (keychainEntry.password !== oldPin) {
      Alert.alert(t('PinCreate.ValidOldPin'))
    } else {
      passcodeCreate(newPin)
    }
  }

  return (
    <SafeAreaView style={[style.container]}>
      <TextInput
        label={t('Global.OldPin')}
        placeholder={t('Global.6DigitPin')}
        placeholderTextColor={Colors.lightGrey}
        accessible
        accessibilityLabel={t('Global.OldPin')}
        maxLength={6}
        autoFocus
        secureTextEntry
        keyboardType="number-pad"
        value={pin}
        onChangeText={setPin}
      />
      <TextInput
        label={t('Global.EnterNewPin')}
        accessible
        accessibilityLabel={t('Global.EnterNewPin')}
        placeholder={t('Global.6DigitPin')}
        placeholderTextColor={Colors.lightGrey}
        maxLength={6}
        secureTextEntry
        keyboardType="number-pad"
        value={pinTwo}
        onChangeText={(text: string) => {
          setPinTwo(text)
        }}
      />
      <TextInput
        label={t('PinCreate.ReenterNewPin')}
        accessible
        accessibilityLabel={t('PinCreate.ReenterNewPin')}
        placeholder={t('Global.6DigitPin')}
        placeholderTextColor={Colors.lightGrey}
        maxLength={6}
        secureTextEntry
        keyboardType="number-pad"
        value={pinThree}
        onChangeText={(text: string) => {
          setPinThree(text)
          if (text.length === 6) {
            Keyboard.dismiss()
          }
        }}
      />
      <Button
        title="Change PIN"
        buttonType={ButtonType.Primary}
        onPress={() => {
          Keyboard.dismiss()
          confirmEntry(pin, pinTwo, pinThree)
        }}
      />
    </SafeAreaView>
  )
}

export default ChangePin
