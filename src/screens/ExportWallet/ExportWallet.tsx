import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  StyleSheet,
  PermissionsAndroid,
  Platform,
  View,
  Keyboard,
} from 'react-native';
import Toast from 'react-native-toast-message';
import RNFS from 'react-native-fs';
import { WalletExportImportConfig } from '@aries-framework/core/build/types';
import { useAgent } from '@aries-framework/react-hooks';
import argon2 from 'react-native-argon2';
import { UserCredentials } from 'react-native-keychain';
import { useNavigation } from '@react-navigation/core';
import { Loader, TextInput } from '../../components';
import { ToastType } from '../../components/toast/BaseToast';
import { KeychainStorageKeys, salt } from '../../constants';
import Button, { ButtonType } from '../../components/button/Button';
import { ColorPallet, TextTheme } from '../../theme/theme';
import { getValueKeychain } from '../../utils/keychain';
import { authenticateUser } from './ExportWallet.utils';

const ExportWallet = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [mnemonic, setMnemonic] = useState('');
  const { agent } = useAgent();
  const nav = useNavigation();

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
        );

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          exportWallet();
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      exportWallet();
    }
  };

  const exportWallet = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Permission',
          message: 'PCM needs to write to storage ',
          buttonPositive: '',
        },
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        Keyboard.dismiss();
        setLoading(true);
        const documentDirectory = RNFS.DownloadDirectoryPath;

        const zipDirectory = `${documentDirectory}/PCM_Backup`;

        const destFileExists = await RNFS.exists(zipDirectory);
        if (destFileExists) {
          await RNFS.unlink(zipDirectory);
        }

        const date = new Date();
        const dformat = `${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}`;
        const WALLET_FILE_NAME = `PCM_Wallet_${dformat}`;

        await RNFS.mkdir(zipDirectory)
          .then(() => console.log('generated'))
          .catch(err => console.log('not generated', err));
        const encryptedFileName = `${WALLET_FILE_NAME}.wallet`;
        const encryptedFileLocation = `${zipDirectory}/${encryptedFileName}`;

        const passphraseEntry = (await getValueKeychain({
          service: KeychainStorageKeys.Passphrase,
        })) as UserCredentials;

        const result = await argon2(passphraseEntry.password, salt, {
          iterations: 5,
          memory: 16 * 1024,
          parallelism: 2,
          hashLength: 20,
          mode: 'argon2i',
        });

        const { encodedHash } = result;

        const exportConfig: WalletExportImportConfig = {
          key: encodedHash,
          path: encryptedFileLocation,
        };
        await agent?.wallet.export(exportConfig);
        Toast.show({
          type: ToastType.Success,
          text1: t<string>('ExportWallet.WalletExportedPath'),
          text2: t<string>(zipDirectory),
        });
        setLoading(false);
        nav.goBack();
      } else {
        setLoading(false);
        console.log(
          'Permission Denied!',
          'You need to give  permission to see contacts',
        );
      }
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };

  const compareMnemonic = async () => {
    const passphraseEntry = (await getValueKeychain({
      service: KeychainStorageKeys.Passphrase,
    })) as UserCredentials;

    if (mnemonic !== '') {
      const params = [mnemonic, passphraseEntry.password];
      const result = authenticateUser(params);
      if (result) {
        Toast.show({
          type: ToastType.Success,
          text1: t<string>('Toasts.Success'),
          text2: t<string>('Settings.ValidMnemonic'),
        });
        askPermission();
      } else {
        Toast.show({
          type: ToastType.Error,
          text1: t<string>('Toasts.Error'),
          text2: t<string>('Settings.InvalidMnemonic'),
        });
      }
    } else {
      Toast.show({
        type: ToastType.Warn,
        text1: t<string>('Toasts.Warning'),
        text2: t<string>('Settings.MnemonicMsg'),
      });
    }
  };

  return (
    <View style={style.container}>
      <Loader loading={loading} />
      <TextInput
        label=""
        placeholder={t<string>('Settings.EnterMnemonic')}
        placeholderTextColor={ColorPallet.brand.primary}
        accessible
        accessibilityLabel={t<string>('Settings.EnterMnemonic')}
        autoFocus
        value={mnemonic}
        onChangeText={setMnemonic}
        autoCapitalize="none"
        returnKeyType="done"
      />
      <Button
        title={t<string>('Settings.ExportWallet')}
        buttonType={ButtonType.Primary}
        onPress={compareMnemonic}
      />
    </View>
  );
};

export default ExportWallet;

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
});
