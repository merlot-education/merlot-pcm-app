import { t } from 'i18next';
import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Keyboard,
  PermissionsAndroid,
  BackHandler,
} from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';
import DocumentPicker from 'react-native-document-picker';
import Toast from 'react-native-toast-message';
import argon2 from 'react-native-argon2';
import {
  WalletExportImportConfig,
  WalletConfig,
} from '@aries-framework/core/build/types';
import { UserCredentials } from 'react-native-keychain';
import { agentDependencies } from '@aries-framework/react-native';
import Config from 'react-native-config';
import {
  Agent,
  AutoAcceptCredential,
  AutoAcceptProof,
  ConsoleLogger,
  HttpOutboundTransport,
  LogLevel,
  MediatorPickupStrategy,
  WsOutboundTransport,
} from '@aries-framework/core';
import { StackScreenProps } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Button, { ButtonType } from '../../components/button/Button';
import { ColorPallet, TextTheme } from '../../theme/theme';
import { TextInput, Loader, Text } from '../../components';
import { getValueKeychain } from '../../utils/keychain';
import { ToastType } from '../../components/toast/BaseToast';
import { KeychainStorageKeys, LocalStorageKeys, salt } from '../../constants';
import indyLedgers from '../../../configs/ledgers/indy';
import { OnboardingStackParams, Screens } from '../../types/navigators';
import { createMD5HashFromString } from './ImportWallet.utils';
import { saveValueInKeychain } from '../../utils/generic';

type ImportWalletProps = StackScreenProps<
  OnboardingStackParams,
  Screens.ImportWallet
>;

const ImportWallet: React.FC<ImportWalletProps> = ({ navigation, route }) => {
  const { setAgent, setAuthenticated, setActive } = route.params;
  const [mnemonic, setMnemonic] = useState('');
  const [walletBackupFilePath, setwalletBackupFIlePath] = useState('');
  const [loading, setLoading] = useState(false);

  const storeOnboardingCompleteStage = async () => {
    await AsyncStorage.setItem(
      LocalStorageKeys.OnboardingCompleteStage,
      'true',
    );
  };

  useEffect(() => {
    const handleBackButtonClick = () => {
      navigation.goBack();
      return true;
    };
    BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
    return () => {
      BackHandler.removeEventListener(
        'hardwareBackPress',
        handleBackButtonClick,
      );
    };
  }, [navigation]);

  const askPermission = async () => {
    PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    ])
      .then(result => {
        if (
          result['android.permission.READ_EXTERNAL_STORAGE'] &&
          result['android.permission.WRITE_EXTERNAL_STORAGE'] === 'granted'
        ) {
          pickBackupFile();
        }
      })
      .catch(error => {
        Toast.show({
          type: ToastType.Error,
          text1: t<string>('Toasts.Warning'),
          text2: t<string>(error),
        });
      });
  };

  const pickBackupFile = async () => {
    try {
      const res = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.allFiles],
        copyTo: 'documentDirectory',
      });
      // const exportedFileContent = await RNFS.readFile(res.uri, 'base64')
      RNFetchBlob.fs
        .stat(res.fileCopyUri)
        .then(stats => {
          setwalletBackupFIlePath(stats.path);
          // output: /storage/emulated/0/WhatsApp/Media/WhatsApp Images/IMG-20200831-WA0019.jpg
        })
        .catch((err: any) => {
          Toast.show({
            type: ToastType.Error,
            text1: t<string>('Toasts.Warning'),
            text2: t<string>(err),
          });
        });
    } catch (err: any) {
      if (DocumentPicker.isCancel(err)) {
        Toast.show({
          type: ToastType.Error,
          text1: t<string>('Toasts.Warning'),
          text2: t<string>(err),
        });
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        Toast.show({
          type: ToastType.Error,
          text1: t<string>('Toasts.Warning'),
          text2: t<string>(err),
        });
      }
    }
  };
  const importWallet = async () => {
    if (mnemonic.length === 0) {
      Toast.show({
        type: ToastType.Warn,
        text1: t<string>('Toasts.Warning'),
        text2: t<string>('ImportWallet.EmptyMnemonic'),
      });
    } else {
      setLoading(true);
      const guidEntry = (await getValueKeychain({
        service: KeychainStorageKeys.GUID,
      })) as UserCredentials;
      const keychainEntry = (await getValueKeychain({
        service: KeychainStorageKeys.Passcode,
      })) as UserCredentials;

      const result = await argon2(mnemonic, salt, {
        iterations: 5,
        memory: 16 * 1024,
        parallelism: 2,
        hashLength: 20,
        mode: 'argon2i',
      });

      const { encodedHash } = result;

      const importConfig: WalletExportImportConfig = {
        key: encodedHash,
        path: walletBackupFilePath,
      };

      const walletConfig: WalletConfig = {
        id: guidEntry.password,
        key: keychainEntry.password,
      };

      const rawValue = guidEntry.password + mnemonic.replace(/ /g, '');
      const seedHash = createMD5HashFromString(rawValue);

      const newAgent = new Agent(
        {
          label: guidEntry.password, // added guid as label
          mediatorConnectionsInvite: Config.MEDIATOR_URL,
          walletConfig,
          mediatorPickupStrategy: MediatorPickupStrategy.Implicit,
          autoAcceptConnections: true,
          autoAcceptCredentials: AutoAcceptCredential.ContentApproved,
          autoAcceptProofs: AutoAcceptProof.ContentApproved,
          logger: new ConsoleLogger(LogLevel.trace),
          publicDidSeed: seedHash,
          autoUpdateStorageOnStartup: true,
          indyLedgers,
        },
        agentDependencies,
      );

      const wsTransport = new WsOutboundTransport();
      const httpTransport = new HttpOutboundTransport();

      newAgent.registerOutboundTransport(wsTransport);
      newAgent.registerOutboundTransport(httpTransport);

      try {
        await newAgent.wallet.import(walletConfig, importConfig);
        await newAgent.wallet.initialize(walletConfig);
        await newAgent.initialize();
        await storeOnboardingCompleteStage();
        setAgent(newAgent);
        await saveValueInKeychain(
          KeychainStorageKeys.Passphrase,
          mnemonic,
          t<string>('Registration.MnemonicMsg'),
        );
        setAuthenticated(true);
        setActive(true);
        setLoading(false);
      } catch (e) {
        setLoading(false);
        Toast.show({
          type: ToastType.Error,
          text1: t<string>('Toasts.Warning'),
          text2: t<string>('ImportWallet.ImportError'),
        });
      }
    }
  };

  return (
    <View style={styles.container}>
      <Loader loading={loading} />
      <View style={styles.btnContainer}>
        <Button
          title={t<string>('ImportWallet.SelectWalletFile')}
          buttonType={ButtonType.Primary}
          onPress={() => {
            Keyboard.dismiss();
            askPermission();
          }}
        />
      </View>
      <Text style={styles.label}>{walletBackupFilePath}</Text>
      <TextInput
        label={t<string>('Settings.EnterMnemonic')}
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
      <View style={styles.btnContainer}>
        <Button
          title={t<string>('Global.ImportWallet')}
          buttonType={ButtonType.Primary}
          disabled={walletBackupFilePath.length === 0 && mnemonic.length === 0}
          onPress={importWallet}
        />
      </View>
    </View>
  );
};

export default ImportWallet;

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
});
