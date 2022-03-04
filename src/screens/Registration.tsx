import React, { useState } from 'react'
import { Alert, Keyboard, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'
import { setValueKeychain } from '../utils/keychain'
import { Colors } from '../theme/theme'
import { TextInput } from '../components'
import Button, { ButtonType } from '../components/button/Button'
import Screens from '../utils/constants'
import * as api from '../api'

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

  const emailCreate = async (emailId: string) => {
    const description = t('Registration.UserAuthenticationEmail')
    try {
      setValueKeychain(description, emailId, {
        service: 'email',
      })
    } catch (e) {
      Alert.alert(e)
    }
  }

  const validateEmail = email => {
    return email.match(
      // eslint-disable-next-line no-control-regex
      /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/,
    )
  }

  const confirmEntry = async (email: string) => {
    if (email.length > 0) {
      if (validateEmail(email)) {
        emailCreate(email)
        const res = await api.default.auth.register({ email })
        if (res?.data) {
          navigation.navigate(Screens.VerifyOtp, { email })
          Alert.alert(res?.message)
        }
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
