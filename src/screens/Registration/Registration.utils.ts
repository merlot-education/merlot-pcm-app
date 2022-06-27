import AsyncStorage from '@react-native-async-storage/async-storage'
import { Alert } from 'react-native'
import api from '../../api'
import { EMAIL_REGEX, LocalStorageKeys } from '../../constants'
import { setValueKeychain } from '../../utils/keychain'
import wordsList from '../../utils/wordsList'

export const getMnemonicArrayFromWords = (lengthOfWords: number): string[] => {
  const wordsArray = []
  for (let index = 1; index <= lengthOfWords; index += 1) {
    let diceNumber = ''
    for (let mnemonicWord = 0; mnemonicWord < 5; mnemonicWord += 1) {
      const num = Math.floor(Math.random() * 6) + 1
      diceNumber += num
    }
    const element = wordsList[diceNumber]
    wordsArray.push(element)
  }
  return wordsArray
}

export const saveValueInKeychain = async (
  service: string,
  value: string,
  description: string,
) => {
  try {
    await setValueKeychain(description, value, {
      service,
    })
  } catch (e) {
    Alert.alert(e)
  }
}

export const registerUser = async (email: string, otpId: string) => {
  const data = await api.auth.register({
    email,
    otpId,
  })
  return data
}

export const validateEmail = (email: string): boolean => {
  return EMAIL_REGEX.test(email)
}

export const restoreTermsCompleteStage = async () => {
  await AsyncStorage.removeItem(LocalStorageKeys.OnboardingCompleteStage)
}
