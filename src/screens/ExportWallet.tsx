import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Keyboard, SafeAreaView, StyleSheet } from 'react-native'
import { zipWithPassword } from 'react-native-zip-archive'
import { DocumentDirectoryPath } from 'react-native-fs'
import { TextInput } from '../components'

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
  const [mnemonic, setMnemonic] = useState(
    'wielder endless flavorful calibrate vagueness devotion vagabond snaking',
  )

  const compareMnemonic = async () => {
    const mnemonicText = await getValueKeychain({
      service: 'mnemonicText',
    })
    if (mnemonic.trim() === mnemonicText?.password.trim()) {
      console.log('========true===============')
    }
  }

  const startArchiveTest = async () => {
    const targetPath = `${DocumentDirectoryPath}/myFile.zip`
    const sourcePath = DocumentDirectoryPath
    const password = 'password'

    zipWithPassword(sourcePath, targetPath, password)
      .then(path => {
        console.log(`zip completed at ${path}`)
      })
      .catch(error => {
        console.error(error)
      })
  }

  return (
    <SafeAreaView style={style.container}>
      <TextInput
        label={t('Global.EnterMnemonic')}
        placeholder={t('Global.EnterMnemonic')}
        placeholderTextColor={ColorPallet.brand.primary}
        accessible
        accessibilityLabel={t('Global.EnterMnemonic')}
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
      <Button
        title={t('Global.Submit')}
        buttonType={ButtonType.Primary}
        onPress={startArchiveTest}
      />
    </SafeAreaView>
  )
}

export default ExportWallet
