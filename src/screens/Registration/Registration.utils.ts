import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import api from '../../api';
import { EMAIL_REGEX, LocalStorageKeys } from '../../constants';
import { setValueKeychain } from '../../utils/keychain';
import wordsList from '../../utils/wordsList';

export const registerUser = async (email: string, otpId: string) => {
  const data = await api.auth.register({
    email,
    otpId,
  });
  return data;
};

export const validateEmail = (email: string): boolean => {
  return EMAIL_REGEX.test(email);
};

export const restoreTermsCompleteStage = async () => {
  await AsyncStorage.removeItem(LocalStorageKeys.OnboardingCompleteStage);
};
