import AsyncStorage from '@react-native-async-storage/async-storage'
import ReactNativeBiometrics from 'react-native-biometrics'
import i18next from 'i18next'
import { LocalStorageKeys } from '../../constants'

export const storeOnboardingCompleteStage = async () => {
  await AsyncStorage.setItem(LocalStorageKeys.OnboardingCompleteStage, 'true')
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

export const createBiometricKeys = async () => {
  const result = await ReactNativeBiometrics.createKeys()
  return result
}
