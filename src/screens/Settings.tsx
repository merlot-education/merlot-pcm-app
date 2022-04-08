import { StackScreenProps } from '@react-navigation/stack'
import argon2 from 'react-native-argon2'
import React from 'react'
import { useTranslation } from 'react-i18next'
import moment from 'moment'
import {
  StyleSheet,
  View,
  Alert,
  PermissionsAndroid,
  Platform,
  NativeModules,
} from 'react-native'
import { getVersion, getBuildNumber } from 'react-native-device-info'
import { zip } from 'react-native-zip-archive'
import RNFetchBlob from 'rn-fetch-blob'
import { WalletExportImportConfig } from '@aries-framework/core/build/types'
import { useAgent } from '@aries-framework/react-hooks'
import { borderRadius, ColorPallet, TextTheme } from '../theme/theme'
import { Screens, SettingStackParams } from '../types/navigators'
import { SettingListItem, Text } from '../components'
import { KeychainStorageKeys } from '../constants'
import { getValueKeychain } from '../utils/keychain'

const APP_DIRECTORY = 'PCM_WALLET_BACKUP'

const { RNRandomBytes } = NativeModules

type SettingsProps = {
  navigation: StackScreenProps<SettingStackParams, Screens.Settings>
  setAuthenticated: React.Dispatch<React.SetStateAction<boolean>>
}
const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 20,
  },
  groupHeader: {
    ...TextTheme.normal,
    marginBottom: 8,
  },
  bodyText: {
    ...TextTheme.normal,
    flexShrink: 1,
    color: ColorPallet.brand.primary,
  },
  rowGroup: {
    borderRadius: borderRadius * 2,
    backgroundColor: ColorPallet.baseColors.lightBlue,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
  },
})

const Settings: React.FC<SettingsProps> = ({
  navigation,
  setAuthenticated,
}) => {
  const { t } = useTranslation()
  const { fs } = RNFetchBlob
  const { agent } = useAgent()
  const logoff = () =>
    Alert.alert(t('Settings.Logout'), t('Settings.LogoutMsg'), [
      {
        text: t('Settings.Yes'),
        onPress: () => setAuthenticated(false),
      },
      { text: t('Settings.No') },
    ])

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
        const documentDirectory = fs.dirs.DownloadDir

        const zipDirectory = `${documentDirectory}/PCM_Backup`

        const destFileExists = await fs.exists(zipDirectory)
        if (destFileExists) {
          await fs.unlink(zipDirectory)
        }

        const WALLET_FILE_NAME = `PCM_Wallet_${moment(
          new Date().toString(),
        ).format('DD-MMMM-YYYY_hmmssA')}`

        await fs
          .mkdir(zipDirectory)
          .then(() => console.log('generated'))
          .catch(err => console.log('not generated', err))
        const encryptedFileName = `${WALLET_FILE_NAME}.wallet`
        const encryptedFileLocation = `${zipDirectory}/${encryptedFileName}`

        const salt =
          '1234567891011121314151617181920212223242526272829303132333435363'

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
        await agent.wallet.export(exportConfig)
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

  return (
    <View style={styles.container}>
      <Text style={styles.groupHeader}>{t('Settings.AppPreferences')}</Text>
      <SettingListItem
        title={t('Settings.ChangePin')}
        onPress={() => navigation.navigate(Screens.ChangePin)}
      />
      <SettingListItem
        title={t('Settings.Language')}
        onPress={() => navigation.navigate(Screens.Language)}
      />
      <SettingListItem title={t('Settings.Logout')} onPress={logoff} />
      <SettingListItem
        title={t('Settings.ExportWallet')}
        onPress={exportWallet}
      />
      <Text style={styles.groupHeader}>{t('Settings.AboutApp')}</Text>
      <View style={styles.rowGroup}>
        <View style={styles.row}>
          <Text style={styles.bodyText}>{t('Settings.Version')}</Text>
          <Text
            style={styles.bodyText}
          >{`${getVersion()}.${getBuildNumber()}`}</Text>
        </View>
      </View>
    </View>
  )
}

export default Settings
