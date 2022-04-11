import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { SafeAreaView, StyleSheet } from 'react-native'
import Toast from 'react-native-toast-message'
import { TextInput } from '../components'
import { ToastType } from '../components/toast/BaseToast'

import Button, { ButtonType } from '../components/button/Button'
import { ColorPallet, TextTheme } from '../theme/theme'
import { getValueKeychain } from '../utils/keychain'

const style = StyleSheet.create({
  container: {
    backgroundColor: ColorPallet.grayscale.white,
    margin: 20,
  },
  bodyText: {
    ...TextTheme.normal,
    flexShrink: 1,
  },
  verticalSpacer: {
    marginVertical: 20,
    textAlign: 'center',
  },
})

const ExportWallet = () => {
  const { t } = useTranslation()
  const [mnemonic, setMnemonic] = useState('')

  const compareMnemonic = async () => {
    const mnemonicText = await getValueKeychain({
      service: 'mnemonicText',
    })
    if (mnemonic !== '') {
      if (mnemonic.trim() === mnemonicText?.password.trim()) {
        Toast.show({
          type: ToastType.Success,
          text1: t('Toasts.Success'),
          text2: t('PinCreate.ValidMnemonic'),
        })
      } else {
        Toast.show({
          type: ToastType.Error,
          text1: t('Toasts.Error'),
          text2: t('Settings.InvalidMnemonic'),
        })
      }
    } else {
      Toast.show({
        type: ToastType.Warn,
        text1: t('Toasts.Warning'),
        text2: t('Settings.MnemonicMsg'),
      })
    }
  }

  return (
    <SafeAreaView style={style.container}>
      <TextInput
        label={t('Settings.EnterMnemonic')}
        placeholder={t('Settings.EnterMnemonic')}
        placeholderTextColor={ColorPallet.brand.primary}
        accessible
        accessibilityLabel={t('Settings.EnterMnemonic')}
        autoFocus
        value={mnemonic}
        onChangeText={setMnemonic}
        autoCapitalize="none"
      />
      <Button
        title={t('Global.Submit')}
        buttonType={ButtonType.Primary}
        onPress={compareMnemonic}
      />
    </SafeAreaView>
  )
}

export default ExportWallet
