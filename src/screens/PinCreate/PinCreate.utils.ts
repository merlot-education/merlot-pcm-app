import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import ReactNativeBiometrics from 'react-native-biometrics';
import md5 from 'md5';
import i18next from 'i18next';
import { LocalStorageKeys } from '../../constants';
import { getValueKeychain, setValueKeychain } from '../../utils/keychain';

const rnBiometrics = new ReactNativeBiometrics();

export const storeOnboardingCompleteStage = async () => {
  await AsyncStorage.setItem(LocalStorageKeys.OnboardingCompleteStage, 'true');
};

export const getValueFromKeychain = async (key: string) => {
  const data = await getValueKeychain({
    service: key,
  });
  return data;
};

export const saveValueInKeychain = async (
  service: string,
  value: string,
  description: string,
) => {
  try {
    await setValueKeychain(description, value, {
      service,
    });
  } catch (e: any) {
    Alert.alert(e);
  }
};

export const checkIfSensorAvailable = async () => {
  const result = await rnBiometrics.isSensorAvailable();
  return result;
};

export const showBiometricPrompt = async () => {
  const result = await rnBiometrics.simplePrompt({
    promptMessage: i18next.t('Biometric.BiometricConfirm'),
  });
  return result;
};

export const createBiometricKeys = async () => {
  const result = await rnBiometrics.createKeys();
  return result;
};

export const createMD5HashFromString = (value: string) => {
  const hash = String(md5(value));
  return hash;
};
