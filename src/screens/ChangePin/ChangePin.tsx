import React, { useState } from 'react'
import { Alert, Keyboard, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'
import { StackScreenProps } from '@react-navigation/stack'
// import Toast from 'react-native-toast-message'
import { useAgent } from '@aries-framework/react-hooks'
// import { getValueKeychain, setValueKeychain } from '../../utils/keychain'
import { ColorPallet } from '../../theme/theme'
import { Loader, TextInput } from '../../components'
import Button, { ButtonType } from '../../components/button/Button'
import { Screens, SettingStackParams } from '../../types/navigators'
// import { ToastType } from '../../components/toast/BaseToast'
import { warningToast } from '../../utils/toast'
import { KeychainStorageKeys } from '../../constants'
import { getValueFromKeychain, saveValueInKeychain } from './ChangePin.utils'

type ChangePinProps = StackScreenProps<SettingStackParams, Screens.ChangePin>

const style = StyleSheet.create({
  container: {
    backgroundColor: ColorPallet.grayscale.white,
    margin: 20,
  },
})

const ChangePin: React.FC<ChangePinProps> = () => {
  const [loading, setLoading] = useState(false)
  const [pin, setPin] = useState('')
  const [pinTwo, setPinTwo] = useState('')
  const [pinThree, setPinThree] = useState('')
  const { t } = useTranslation()
  const { agent } = useAgent()

  const passcodeCreate = async (passcode: string) => {
    try {
      // const email = await getValueKeychain({
      //   service: 'email',
      // })
      // const oldPasscode = await getValueKeychain({
      //   service: 'passcode',
      // })
      const [email, oldPasscode] = await Promise.all([
        new Promise(resolve => {
          resolve(getValueFromKeychain(KeychainStorageKeys.Email))
        }),
        new Promise(resolve => {
          resolve(getValueFromKeychain(KeychainStorageKeys.Passcode))
        }),
        new Promise(resolve => {
          resolve(
            saveValueInKeychain(
              KeychainStorageKeys.Passcode,
              passcode,
              'passcode',
            ),
          )
        }),
      ])
      setLoading(true)
      await agent.shutdown()
      await agent.wallet.rotateKey({
        id: email.password,
        key: oldPasscode.password,
        rekey: passcode,
      })
      await agent.initialize()
      // await setValueKeychain(description, passcode, {
      //   service: 'passcode',
      // })
      setLoading(false)
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
    const [passcode] = await Promise.all([
      new Promise(resolve => {
        resolve(getValueFromKeychain(KeychainStorageKeys.Passcode))
      }),
    ])

    if (oldPin.length < 6 || newPin.length < 6) {
      warningToast(t('PinCreate.PinMustBe6DigitsInLength'))
    } else if (newPin !== reEnterNewPin) {
      warningToast(t('PinCreate.PinsEnteredDoNotMatch'))
    } else if (passcode.password !== oldPin) {
      warningToast(t('PinCreate.ValidOldPin'))
    } else {
      passcodeCreate(newPin)
    }
  }

  return (
    <SafeAreaView style={[style.container]}>
      <Loader loading={loading} />
      <TextInput
        label={t('Global.OldPin')}
        placeholder={t('Global.6DigitPin')}
        placeholderTextColor={ColorPallet.baseColors.lightGrey}
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
        placeholderTextColor={ColorPallet.baseColors.lightGrey}
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
        placeholderTextColor={ColorPallet.baseColors.lightGrey}
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
