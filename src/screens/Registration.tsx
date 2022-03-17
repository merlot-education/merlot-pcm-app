import React, { useState, useEffect } from 'react'
import { Alert, Keyboard, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'
import Toast from 'react-native-toast-message'
import Clipboard from '@react-native-community/clipboard'
import { setValueKeychain } from '../utils/keychain'
import { Colors, TextTheme, ColorPallet } from '../theme/theme'
import { TextInput, Loader } from '../components'
import Button, { ButtonType } from '../components/button/Button'
import { Screens } from '../types/navigators'
import * as api from '../api'
import { ToastType } from '../components/toast/BaseToast'
import Mnemonic from '../utils/mnemonic'

interface PinCreateProps {
  navigation: any
  route: any
}

const style = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    margin: 20,
  },
  btnContainer: {
    marginTop: 20,
  },
  bodyText: {
    ...TextTheme.caption,
    flexShrink: 1,
    fontWeight: 'bold',
    marginVertical: 20,
  },
  boxContainer: {
    backgroundColor: ColorPallet.notification.info,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: ColorPallet.notification.infoBorder,
    padding: 10,
    marginTop: 10,
    marginBottom: 20,
  },
  label: {
    ...TextTheme.label,
  },
  headerText: {
    ...TextTheme.normal,
    color: ColorPallet.notification.infoText,
    flexShrink: 1,
  },
})

const Registration: React.FC<PinCreateProps> = ({ navigation, route }) => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [mnemonicText, setMnemonicText] = useState('')

  const { t } = useTranslation()

  useEffect(() => {
    const wordsArray = []
    let mnemonic = ''
    for (let index = 1; index <= 8; index += 1) {
      let diceNumber = ''
      for (let mnemonicWord = 0; mnemonicWord < 5; mnemonicWord += 1) {
        const num = Math.floor(Math.random() * 6) + 1
        diceNumber += num
      }
      const element = Mnemonic[diceNumber]
      wordsArray.push(element)
      mnemonic += `${element} `
      setMnemonicText(mnemonic)
    }
  }, [])

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
    const { forgotPin } = route.params
    if (email.length > 0) {
      if (validateEmail(email)) {
        emailCreate(email)
        setLoading(true)
        try {
          await api.default.auth.register({ email })
          navigation.navigate(Screens.VerifyOtp, { email })
          setLoading(false)
          if (forgotPin) {
            navigation.navigate(Screens.VerifyOtp, { email, forgotPin })
          } else {
            navigation.navigate(Screens.VerifyOtp, { email, forgotPin })
          }
        } catch (error) {
          setLoading(false)
          Toast.show({
            type: ToastType.Error,
            text1: error.name,
            text2: error.message,
          })
        }
      } else {
        Toast.show({
          type: ToastType.Warn,
          text1: t('Toasts.Warning'),
          text2: t('Registration.ValidEmail'),
        })
      }
    } else {
      Toast.show({
        type: ToastType.Warn,
        text1: t('Toasts.Warning'),
        text2: t('Registration.EnterEmail'),
      })
    }
  }

  return (
    <SafeAreaView style={[style.container]}>
      <Loader loading={loading} />
      <TextInput
        label={t('Global.Email')}
        placeholder={t('Global.Email')}
        placeholderTextColor={Colors.primary}
        accessible
        accessibilityLabel={t('Global.Email')}
        autoFocus
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <Text style={style.label}>Mnemonic</Text>
      <View style={style.boxContainer}>
        <Text style={style.headerText} selectable>
          {mnemonicText}
        </Text>
        <Text style={style.bodyText}>{t('Registration.MnemonicMsg')}</Text>
        <Button
          title={t('Global.Copy')}
          buttonType={ButtonType.Primary}
          onPress={() => Clipboard.setString(mnemonicText)}
        />
      </View>
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
