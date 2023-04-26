import React, { useState, useEffect, useCallback } from 'react';
import {
  Alert,
  BackHandler,
  Keyboard,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { StackScreenProps } from '@react-navigation/stack';
import { useFocusEffect } from '@react-navigation/native';
import { UserCredentials } from 'react-native-keychain';
import { TextInput, Loader } from '../../components';
import Button, { ButtonType } from '../../components/button/Button';
import { ColorPallet, TextTheme } from '../../theme/theme';
import { OnboardingStackParams, Screens } from '../../types/navigators';
import { KeychainStorageKeys } from '../../constants';
import {
  checkIfSensorAvailable,
  removeOnboardingCompleteStage,
  createMD5HashFromString,
  showBiometricPrompt,
} from './PinEnter.utils';
import { getValueFromKeychain } from '../../utils/generic';
import { warningToast, errorToast, successToast } from '../../utils/toast';

type PinEnterProps = StackScreenProps<OnboardingStackParams, Screens.EnterPin>;

const PinEnter: React.FC<PinEnterProps> = ({ navigation, route }) => {
  const { initAgent, setAuthenticated } = route.params;
  const [pin, setPin] = useState('');
  const [loginAttemtsFailed, setLoginAttemtsFailed] = useState(0);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        BackHandler.exitApp();
        return true;
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, []),
  );

  const startAgent = useCallback(async () => {
    const [guid, passphrase, passcode] = (await Promise.all([
      new Promise(resolve => {
        resolve(getValueFromKeychain(KeychainStorageKeys.GUID));
      }),
      new Promise(resolve => {
        resolve(getValueFromKeychain(KeychainStorageKeys.Passphrase));
      }),
      new Promise(resolve => {
        resolve(getValueFromKeychain(KeychainStorageKeys.Passcode));
      }),
    ])) as UserCredentials[];
    if (guid && passphrase) {
      const rawValue = passphrase.password.replace(/ /g, '');
      const seedHash = createMD5HashFromString(rawValue);
      await initAgent(guid.password, passcode.password, seedHash);
    }
  }, [initAgent]);

  const checkBiometricIfPresent = useCallback(async () => {
    const { available } = await checkIfSensorAvailable();
    if (available) {
      const { success, error } = await showBiometricPrompt();
      if (success) {
        setLoading(true);
        await startAgent();
        setLoading(false);
        setAuthenticated(true);
      } else if (error) {
        warningToast(error);
      } else {
        warningToast(t<string>('Biometric.BiometricCancle'));
      }
    }
  }, [setAuthenticated, startAgent, t]);

  useEffect(() => {
    checkBiometricIfPresent();
  }, [checkBiometricIfPresent]);

  const checkPin = async (pin: string) => {
    const [passcode] = (await Promise.all([
      new Promise(resolve => {
        resolve(getValueFromKeychain(KeychainStorageKeys.Passcode));
      }),
    ])) as UserCredentials[];
    if (pin === passcode.password) {
      setLoading(true);
      await startAgent();
      setAuthenticated(true);
      setLoading(false);
    } else {
      warningToast(t<string>('PinEnter.IncorrectPin'));
      setLoginAttemtsFailed(loginAttemtsFailed + 1);
      if (loginAttemtsFailed === 5) {
        Alert.alert(t<string>('Registration.RegisterAgain'));
        navigation.navigate(Screens.EnterPin);
        await removeOnboardingCompleteStage();
      }
    }
  };

  return (
    <View style={[style.container]}>
      <Loader loading={loading} />
      <TextInput
        label={t<string>('Global.EnterPin')}
        accessible
        accessibilityLabel={t<string>('Global.EnterPin')}
        placeholder={t<string>('Global.SixDigitPin')}
        placeholderTextColor={ColorPallet.baseColors.lightGrey}
        maxLength={6}
        keyboardType="numeric"
        secureTextEntry
        value={pin}
        returnKeyType="done"
        onChangeText={(pin: string) => {
          setPin(pin.replace(/[^0-9]/g, ''));
          if (pin.length === 6) {
            Keyboard.dismiss();
          }
        }}
      />
      <Button
        title={t<string>('Global.Submit')}
        buttonType={ButtonType.Primary}
        onPress={() => checkPin(pin)}
      />
    </View>
  );
};

export default PinEnter;

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
