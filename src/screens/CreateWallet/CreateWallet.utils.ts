import { Alert } from 'react-native'
import md5 from 'md5'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { setValueKeychain } from '../../utils/keychain'
import wordsList from '../../utils/wordsList'
import { LocalStorageKeys } from '../../constants'

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
export const createMD5HashFromString = (value: string) => {
  const hash = String(md5(value))
  return hash
}
export const storeOnboardingCompleteStage = async () => {
  await AsyncStorage.setItem(LocalStorageKeys.OnboardingCompleteStage, 'true')
}
