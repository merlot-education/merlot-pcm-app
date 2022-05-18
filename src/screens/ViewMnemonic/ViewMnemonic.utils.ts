import i18next from 'i18next'
import ReactNativeBiometrics from 'react-native-biometrics'
import { KeychainStorageKeys } from '../../constants'
import { getValueKeychain } from '../../utils/keychain'

export const getValueFromKeychain = async (key: string) => {
  const data = await getValueKeychain({
    service: key,
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

export const getMnemonicFromKeychain = async () => {
  const passphraseEntry = await getValueKeychain({
    service: KeychainStorageKeys.Passphrase,
  })
  return passphraseEntry
}
export const authenticateUser = args => {
  const res = args.reduce((prev, curr) => {
    if (prev === curr) return true
    return false
  })
  return res
}
