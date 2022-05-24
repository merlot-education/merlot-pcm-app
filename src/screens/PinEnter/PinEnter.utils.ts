import AsyncStorage from '@react-native-async-storage/async-storage'
import ReactNativeBiometrics from 'react-native-biometrics'
import md5 from 'md5'
import i18next from 'i18next'
import { LocalStorageKeys } from '../../constants'
import { getValueKeychain } from '../../utils/keychain'
import api from '../../api'

export const getValueFromKeychain = async (key: string) => {
  const data = await getValueKeychain({
    service: key,
  })
  return data
}

export const registerUser = async (email: string, otpId: string) => {
  const data = await api.auth.register({
    email,
    otpId,
  })
  return data
}

export const checkIfSensorAvailable = async () => {
  const result = await ReactNativeBiometrics.isSensorAvailable()
  return result
}

export const showBiometricPrompt = async () => {
  const result = await ReactNativeBiometrics.simplePrompt({
    promptMessage: i18next.t('Biometric.BiometricConfirm'),
  })
  return result
}

export const createMD5HashFromString = (value: string) => {
  const hash = String(md5(value))
  return hash
}

export const removeOnboardingCompleteStage = async () => {
  await AsyncStorage.removeItem(LocalStorageKeys.OnboardingCompleteStage)
}
