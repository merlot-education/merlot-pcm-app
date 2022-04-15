import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  SafeAreaView,
  StyleSheet,
  PermissionsAndroid,
  Platform,
} from 'react-native'
import Toast from 'react-native-toast-message'
import RNFetchBlob from 'rn-fetch-blob'
import RNFS from 'react-native-fs'
import { WalletExportImportConfig } from '@aries-framework/core/build/types'
import { useAgent } from '@aries-framework/react-hooks'
import moment from 'moment'
import argon2 from 'react-native-argon2'
import { useNavigation } from '@react-navigation/core'
import { TextInput } from '../components'
import { ToastType } from '../components/toast/BaseToast'
import { KeychainStorageKeys, salt } from '../constants'

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
  // const { fs } = RNFetchBlob
  const { agent } = useAgent()
  const nav = useNavigation()

  const askPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Permission',
            message: 'PCM needs to write to storage ',
            buttonPositive: '',
          },
        )
        const permission = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Permission',
            message: 'PCM needs to write to storage ',
            buttonPositive: '',
          },
        )

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          exportWallet()
        } else {
          console.log(
            'Permission Denied!',
            'You need to give  permission to see contacts',
          )
        }
      } catch (error) {
        console.log(error)
      }
    } else {
      exportWallet()
    }
  }

  const exportWallet = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Permission',
          message: 'PCM needs to write to storage ',
          buttonPositive: '',
        },
      )
      const permission = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Permission',
          message: 'PCM needs to write to storage ',
          buttonPositive: '',
        },
      )

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        const documentDirectory = RNFS.DownloadDirectoryPath

        const zipDirectory = `${documentDirectory}/PCM_Backup`

        const destFileExists = await RNFS.exists(zipDirectory)
        if (destFileExists) {
          await RNFS.unlink(zipDirectory)
        }

        const WALLET_FILE_NAME = `PCM_Wallet_${moment(
          new Date().toString(),
        ).format('DD-MMMM-YYYY_hmmssA')}`

        await RNFS.mkdir(zipDirectory)
          .then(() => console.log('generated'))
          .catch(err => console.log('not generated', err))
        const encryptedFileName = `${WALLET_FILE_NAME}.wallet`
        const encryptedFileLocation = `${zipDirectory}/${encryptedFileName}`

        const email = await getValueKeychain({
          service: KeychainStorageKeys.Email,
        })

        const passphraseEntry = await getValueKeychain({
          service: KeychainStorageKeys.Passphrase,
        })

        const result = await argon2(passphraseEntry.password, salt, {
          iterations: 5,
          memory: 16 * 1024,
          parallelism: 2,
          hashLength: 20,
          mode: 'argon2i',
        })

        const { rawHash, encodedHash } = result

        const exportConfig: WalletExportImportConfig = {
          key: encodedHash,
          path: encryptedFileLocation,
        }
        console.log('export wallet', agent.wallet)
        await agent.wallet.export(exportConfig)
        Toast.show({
          type: ToastType.Success,
          text1: t('ExportWallet.WalletExportedPath'),
          text2: t(zipDirectory),
        })
        nav.goBack()
      } else {
        console.log(
          'Permission Denied!',
          'You need to give  permission to see contacts',
        )
      }
    } catch (err) {
      console.log(err)
    }
  }

  const compareMnemonic = async () => {
    const passphraseEntry = await getValueKeychain({
      service: KeychainStorageKeys.Passphrase,
    })
    if (mnemonic !== '') {
      if (mnemonic.trim() === passphraseEntry?.password.trim()) {
        Toast.show({
          type: ToastType.Success,
          text1: t('Toasts.Success'),
          text2: t('Settings.ValidMnemonic'),
        })
        askPermission()
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
        title={t('Settings.ExportWallet')}
        buttonType={ButtonType.Primary}
        onPress={compareMnemonic}
      />
    </SafeAreaView>
  )
}

export default ExportWallet
