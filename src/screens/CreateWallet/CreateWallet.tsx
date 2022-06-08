import { StackScreenProps } from '@react-navigation/stack'
import React, { useCallback, useEffect, useState } from 'react'
import Clipboard from '@react-native-clipboard/clipboard'
import {
  SafeAreaView,
  ScrollView,
  View,
  Keyboard,
  StyleSheet,
  Text,
} from 'react-native'
import { useTranslation } from 'react-i18next'
import { OnboardingStackParams, Screens } from '../../types/navigators'
import {
  createMD5HashFromString,
  getMnemonicArrayFromWords,
  saveValueInKeychain,
  storeOnboardingCompleteStage,
} from './CreateWallet.utils'
import { KeychainStorageKeys } from '../../constants'
import Button, { ButtonType } from '../../components/button/Button'
import { Loader } from '../../components'
import { ColorPallet, TextTheme } from '../../theme/theme'
import { getValueKeychain } from '../../utils/keychain'
import { errorToast, successToast } from '../../utils/toast'

type CreateWalletProps = StackScreenProps<
  OnboardingStackParams,
  Screens.CreateWallet
>

const style = StyleSheet.create({
  container: {
    backgroundColor: ColorPallet.grayscale.white,
    flex: 1,
  },
  subContainer: {
    backgroundColor: ColorPallet.grayscale.white,
    flex: 1,
    margin: 20,
  },
  bodyText: {
    ...TextTheme.caption,
    flexShrink: 1,
    fontWeight: 'bold',
    marginVertical: 20,
    textAlign: 'justify',
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
    ...TextTheme.normal,
    fontWeight: 'bold',
  },
  headerText: {
    ...TextTheme.normal,
    color: ColorPallet.notification.infoText,
    flexShrink: 1,
  },
})

const CreateWallet: React.FC<CreateWalletProps> = ({ route }) => {
  const { initAgent, setAuthenticated } = route.params
  const [mnemonicText, setMnemonicText] = useState('')
  const [loading, setLoading] = useState(false)
  const { t } = useTranslation()

  const createMnemonic = useCallback(async () => {
    const mnemonicWordsList = getMnemonicArrayFromWords(8)
    const mnemonic = mnemonicWordsList.join(' ')
    setMnemonicText(mnemonic)
    await saveValueInKeychain(
      KeychainStorageKeys.Passphrase,
      mnemonic,
      t('Registration.MnemonicMsg'),
    )
  }, [t])

  useEffect(() => {
    createMnemonic()
  }, [createMnemonic])

  const copyMnemonic = async () => {
    Clipboard.setString(mnemonicText)
  }

  const createWallet = async () => {
    const email = await getValueKeychain({
      service: 'email',
    })
    const pinCode = await getValueKeychain({
      service: 'passcode',
    })
    await startAgent(email.password, pinCode.password)
  }

  const startAgent = async (email: string, pin: string) => {
    try {
      setLoading(true)
      const rawValue = email + mnemonicText.replace(/ /g, '')
      const seedHash = createMD5HashFromString(rawValue)

      await initAgent(email, pin, seedHash)
      await storeOnboardingCompleteStage()
      setLoading(false)
      successToast(t('PinCreate.WalletCreated'))
      setAuthenticated(true)
    } catch (error) {
      setLoading(false)
      errorToast(error.message)
    }
  }

  return (
    <SafeAreaView style={style.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={style.subContainer}
      >
        <Loader loading={loading} />
        <Text style={style.label}>{t('Registration.Mnemonic')}</Text>
        <View style={style.boxContainer}>
          <Text style={style.bodyText}>{t('Registration.MnemonicMsg')}</Text>
          <Text style={style.headerText}>{mnemonicText}</Text>

          <Button
            title={t('Global.Copy')}
            buttonType={ButtonType.Primary}
            onPress={copyMnemonic}
          />
        </View>

        <Button
          title={t('Global.Next')}
          buttonType={ButtonType.Primary}
          onPress={() => {
            Keyboard.dismiss()
            createWallet()
          }}
        />
      </ScrollView>
    </SafeAreaView>
  )
}

export default CreateWallet
