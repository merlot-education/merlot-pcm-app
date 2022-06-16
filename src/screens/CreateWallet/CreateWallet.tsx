import { StackScreenProps } from '@react-navigation/stack'
import React, { useCallback, useEffect, useState } from 'react'
import Clipboard from '@react-native-clipboard/clipboard'
import { View, StyleSheet, Text } from 'react-native'
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
import { InfoCard, Loader, ScreenNavigatorButtons } from '../../components'
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
    margin: 20,
  },
  label: {
    ...TextTheme.normal,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  headerText: {
    ...TextTheme.normal,
    color: ColorPallet.notification.infoText,
    flexShrink: 1,
  },
  btnContainer: {
    marginTop: 20,
    alignSelf: 'center',
  },
})

const CreateWallet: React.FC<CreateWalletProps> = ({ navigation, route }) => {
  const [mnemonicText, setMnemonicText] = useState('')
  const { initAgent } = route.params
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
  const onBack = async () => {
    navigation.navigate(Screens.Registration)
  }

  const startAgent = async (email: string, pin: string) => {
    try {
      const rawValue = email + mnemonicText.replace(/ /g, '')
      const seedHash = createMD5HashFromString(rawValue)

      await initAgent(email, pin, seedHash)
      await storeOnboardingCompleteStage()
      successToast(t('PinCreate.WalletCreated'))
    } catch (error) {
      setLoading(false)
      errorToast(error.message)
    }
  }

  const createWallet = async () => {
    setLoading(true)
    const email = await getValueKeychain({
      service: 'email',
    })
    const pinCode = await getValueKeychain({
      service: 'passcode',
    })
    await startAgent(email.password, pinCode.password)
    setLoading(false)
    navigation.navigate(Screens.WalletInitialized)
  }

  return (
    <View style={style.container}>
      <Loader loading={loading} />
      <Text style={style.label}>{t('Mnemonic.MnemonicTitle')}</Text>
      <View style={style.container}>
        <InfoCard showBottomIcon={false} showTopIcon>
          {t('Registration.MnemonicMsg')}
          <Text style={style.headerText}>{`\n${mnemonicText}`}</Text>
        </InfoCard>
        <Button
          buttonStyle={style.btnContainer}
          title={t('Global.Copy')}
          buttonType={ButtonType.Primary}
          onPress={copyMnemonic}
        />
      </View>
      <ScreenNavigatorButtons
        onLeftPress={onBack}
        onRightPress={() => createWallet()}
      />
    </View>
  )
}

export default CreateWallet
