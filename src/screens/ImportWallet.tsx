import { t } from 'i18next'
import React, { useCallback, useState } from 'react'
import {
  View,
  StyleSheet,
  Keyboard,
  Platform,
  PermissionsAndroid,
  AsyncStorage,
} from 'react-native'
import RNFS from 'react-native-fs'
import DocumentPicker from 'react-native-document-picker'
import Toast from 'react-native-toast-message'
import argon2 from 'react-native-argon2'
import {
  WalletExportImportConfig,
  WalletConfig,
} from '@aries-framework/core/build/types'
import { useAgent } from '@aries-framework/react-hooks'
import { agentDependencies } from '@aries-framework/react-native'
import Config from 'react-native-config'
import {
  Agent,
  AutoAcceptCredential,
  AutoAcceptProof,
  ConsoleLogger,
  LogLevel,
  MediatorPickupStrategy,
} from '@aries-framework/core'
import md5 from 'md5'
import { StackScreenProps } from '@react-navigation/stack'
import Button, { ButtonType } from '../components/button/Button'
import { ColorPallet, TextTheme } from '../theme/theme'
import { TextInput, Loader, Text } from '../components'
import { getValueKeychain } from '../utils/keychain'
import { ToastType } from '../components/toast/BaseToast'
import { KeychainStorageKeys, LocalStorageKeys, salt } from '../constants'
import indyLedgers from '../../configs/ledgers/indy'
import { OnboardingStackParams, Screens } from '../types/navigators'

type ImportWalletProps = StackScreenProps<
  OnboardingStackParams,
  Screens.ImportWallet
>

const styles = StyleSheet.create({
  container: {
    backgroundColor: ColorPallet.grayscale.white,
    margin: 20,
  },
  label: {
    ...TextTheme.normal,
    fontWeight: 'bold',
  },
  btnContainer: {
    marginTop: 20,
  },
})

const ImportWallet: React.FC<ImportWalletProps> = ({ navigation, route }) => {
  const { initAgent, setAuthenticated } = route.params
  const [mnemonic, setMnemonic] = useState('')
  const [walletBackupFilePath, setwalletBackupFIlePath] = useState('')
  const { agent } = useAgent()
  const [loading, setLoading] = useState(false)

  const startAgent = useCallback(async () => {
    const email = await getValueKeychain({
      service: 'email',
    })
    const passphrase = await getValueKeychain({
      service: 'passphrase',
    })
    const pinCode = await getValueKeychain({
      service: 'passcode',
    })
    if (email && passphrase) {
      const hash = email + passphrase.password.replace(/ /g, '')
      const seedHash = String(md5(hash))
      initAgent(email.password, pinCode.password, seedHash)
    }
    setAuthenticated(true)
    await storeOnboardingCompleteStage()
  }, [initAgent, setAuthenticated])
  const storeOnboardingCompleteStage = async () => {
    await AsyncStorage.setItem(LocalStorageKeys.OnboardingCompleteStage, 'true')
  }
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
          pickBackupFile()
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
      pickBackupFile()
    }
  }

  const pickBackupFile = async () => {
    // try {
    //   const res = await DocumentPicker.pickSingle({
    //     type: [DocumentPicker.types.allFiles],
    //     copyTo: 'documentDirectory',
    //   })
    //   RNFetchBlob.fs
    //     .stat(res.uri)
    //     .then(stats => {
    //       console.log(stats.path)
    //       setwalletBackupFIlePath(stats.path)
    //     })
    //     .catch(err => {
    //       console.log(err)
    //     })
    // } catch (err) {
    //   if (DocumentPicker.isCancel(err)) {
    //     // User cancelled the picker, exit any dialogs or menus and move on
    //   } else {
    //     throw console.log('Error from zip', err)
    //   }
    // }
    try {
      const res = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.allFiles],
        copyTo: 'documentDirectory',
      })
      RNFS.readDir(RNFS.ExternalStorageDirectoryPath)
        .then(result => {
          console.log('GOT RESULT', result)
          return Promise.all([RNFS.stat(result[0].path), result[0].path])
        })
        .then(statResult => {
          if (statResult[0].isFile()) {
            console.log('path1 ', statResult[0])
            console.log('path 2', statResult[1])
            setwalletBackupFIlePath(stats.path)
            return RNFS.readFile(statResult[1], 'utf8')
          }
          return 'no file'
        })
        .then(contents => {
          console.log(contents)
        })
        .catch(err => {
          console.log(err.message, err.code)
        })
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        throw console.log('Error from zip', err)
      }
    }
  }
  const importWallet = async () => {
    setLoading(true)
    const emailEntry = await getValueKeychain({
      service: KeychainStorageKeys.Email,
    })
    const keychainEntry = await getValueKeychain({
      service: 'passcode',
    })

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
    console.log('export wallet', agent)
    console.log('wallet congif', walletConfig)
    console.log('import congif', importConfig)

    const newAgent = new Agent(
      {
        label: emailEntry.password, // added email as label
        mediatorConnectionsInvite: Config.MEDIATOR_URL,
        mediatorPickupStrategy: MediatorPickupStrategy.Implicit,
        autoAcceptConnections: true,
        autoAcceptCredentials: AutoAcceptCredential.ContentApproved,
        autoAcceptProofs: AutoAcceptProof.ContentApproved,
        logger: new ConsoleLogger(LogLevel.trace),
        indyLedgers,
      },
      agentDependencies,
    )
    try {
      await newAgent?.wallet.import(walletConfig, importConfig)
      await newAgent.wallet.initialize(walletConfig)
      await startAgent()
      setLoading(false)
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <View style={styles.container}>
      <Loader loading={loading} />
      <View style={styles.btnContainer}>
        <Button
          title={t('ImportWallet.SelectWalletFile')}
          buttonType={ButtonType.Primary}
          onPress={() => {
            Keyboard.dismiss()
            askPermission()
          }}
        />
      </View>
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
      <View style={styles.btnContainer}>
        <Button
          title={t('Global.ImportWallet')}
          buttonType={ButtonType.Primary}
          onPress={importWallet}
        />
      </View>
    </View>
  )
}

export default ImportWallet
