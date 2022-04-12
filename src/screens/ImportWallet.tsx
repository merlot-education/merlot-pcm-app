import { t } from 'i18next'
import React, { useState, useEffect, useCallback } from 'react'
import { View, StyleSheet, Keyboard } from 'react-native'
import RNFetchBlob from 'rn-fetch-blob'
import DocumentPicker from 'react-native-document-picker'
import Toast from 'react-native-toast-message'
import argon2 from 'react-native-argon2'
import {
  WalletExportImportConfig,
  WalletConfig,
} from '@aries-framework/core/build/types'
import md5 from 'md5'
import AgentProvider, { useAgent } from '@aries-framework/react-hooks'
import { Agent } from '@aries-framework/core'
import Button, { ButtonType } from '../components/button/Button'
import { ColorPallet, TextTheme } from '../theme/theme'
import { TextInput, Loader, Text } from '../components'
import { getValueKeychain } from '../utils/keychain'
import { ToastType } from '../components/toast/BaseToast'
import { KeychainStorageKeys } from '../constants'

const styles = StyleSheet.create({
  container: {
    backgroundColor: ColorPallet.grayscale.white,
    margin: 20,
  },
  label: {
    ...TextTheme.normal,
    fontWeight: 'bold',
  },
})
const ImportWallet: React.FC = route => {
  const [mnemonic, setMnemonic] = useState('')
  const [walletBackupFilePath, setwalletBackupFIlePath] = useState('')
  const { agent } = useAgent()
  const pickBackupFile = async () => {
    try {
      let res = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.allFiles],
        copyTo: 'documentDirectory',
      })
      res = {
        ...res,
        fileCopyUri: `file://${decodeURIComponent(res.fileCopyUri)}`,
      }

      let { name } = res
      name = name.substr(0, name.lastIndexOf('.'))

      const { fs } = RNFetchBlob
      const WALLET_FILE_NAME = name

      const restoreDirectoryPath = fs.dirs.DocumentDir
      console.log('**restoreDirectoryPath', restoreDirectoryPath)
      const walletFilePath = `${restoreDirectoryPath}/${WALLET_FILE_NAME}.wallet`
      setwalletBackupFIlePath(walletFilePath)
      const restoreSaltPath = `${restoreDirectoryPath}/salt.json`
      // if (Platform.OS === 'android') {
      //   await unzip(res.fileCopyUri, restoreDirectoryPath)
      // } else {
      //   await unzip(res.uri, restoreDirectoryPath)
      // }

      // this.setState({
      //   showInputScreen: true,
      //   restoreSaltPath,
      //   walletFilePath,
      // })
      console.log('file picked', walletFilePath)
      console.log('salt path', restoreSaltPath)
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        throw console.log('Error from zip', err)
      }
    }
  }
  const compareMnemonic = async () => {
    const emailEntry = await getValueKeychain({
      service: KeychainStorageKeys.Email,
    })
    const keychainEntry = await getValueKeychain({
      service: 'passcode',
    })
    console.log('email ', emailEntry.password)

    console.log('export wallet', agent.wallet)
    const salt =
      '1234567891011121314151617181920212223242526272829303132333435363'
    const result = await argon2(mnemonic, salt, {
      iterations: 5,
      memory: 16 * 1024,
      parallelism: 2,
      hashLength: 20,
      mode: 'argon2i',
    })

    const { rawHash, encodedHash } = result

    const importConfig: WalletExportImportConfig = {
      key: encodedHash,
      path: walletBackupFilePath,
    }
    const walletConfig: WalletConfig = {
      id: emailEntry.password,
      key: keychainEntry.password,
    }
    console.log('export wallet', agent.wallet)
    console.log('wallet congif', walletConfig)
    await agent.wallet
      .import(walletConfig, importConfig)
      .then(() => console.log('generated'))
      .catch(err => console.log('not generated', err))
    await agent.wallet.initialize(walletConfig)
  }

  return (
    <View style={styles.container}>
      <Button
        title={t('ImportWallet.SelectWalletFile')}
        buttonType={ButtonType.Primary}
        onPress={() => {
          Keyboard.dismiss()
          pickBackupFile()
        }}
      />
      <Text style={styles.label}>{walletBackupFilePath}</Text>
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
        title={t('Global.ImportWallet')}
        buttonType={ButtonType.Primary}
        onPress={compareMnemonic}
      />
    </View>
  )
}

export default ImportWallet
