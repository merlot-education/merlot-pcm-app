import React, { useState } from 'react'
import { Alert, Keyboard, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'
import { setValueKeychain } from '../utils/keychain'
import { Colors } from '../theme/theme'
import { TextInput } from '../components'
import Button, { ButtonType } from '../components/button/Button'
import Screens from '../utils/constants'

interface PinCreateProps {
  navigation: any
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

const Registration: React.FC<PinCreateProps> = ({ navigation }) => {
  const [email, setEmail] = useState('')

  const { t } = useTranslation()

  const passcodeCreate = async (pin: string) => {
    const passcode = JSON.stringify(pin)
    const description = t('Registration.UserAuthenticationEmail')
    try {
      setValueKeychain(description, passcode, {
        service: 'email',
      })
    } catch (e) {
      Alert.alert(e)
    }
  }

  const validateEmail = email => {
    return email.match(
      /^(([^<>()[\]\\.,;:\s@\\"]+(\.[^<>()[\]\\.,;:\s@\\"]+)*)|(\\".+\\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    )
  }

  const confirmEntry = (email: string) => {
    if (email.length > 4) {
      if (validateEmail(email)) {
        passcodeCreate(email)
        navigation.navigate(Screens.VerifyOtp)
      } else {
        Alert.alert(t('Registration.ValidEmail'))
      }
    } else {
      Alert.alert(t('Registration.EnterEmail'))
    }
  }
  return (
    <SafeAreaView style={[style.container]}>
      <TextInput
        label={t('Global.Email')}
        placeholder={t('Global.Email')}
        placeholderTextColor={Colors.lightGrey}
        accessible
        accessibilityLabel={t('Global.Email')}
        autoFocus
        value={email}
        onChangeText={setEmail}
      />
      <Button
        title={t('Global.Submit')}
        buttonType={ButtonType.Primary}
        onPress={() => {
          Keyboard.dismiss()
          confirmEntry(email)
        }}
      />
    </SafeAreaView>
  )
}

export default Registration
