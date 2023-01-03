import wordsList from './wordsList';
import { getValueKeychain, setValueKeychain } from './keychain';
import { Alert } from 'react-native';

export const getMnemonicArrayFromWords = (lengthOfWords: number): string[] => {
  const wordsArray = [];
  for (let index = 1; index <= lengthOfWords; index += 1) {
    let diceNumber = '';
    for (let mnemonicWord = 0; mnemonicWord < 5; mnemonicWord += 1) {
      const num = Math.floor(Math.random() * 6) + 1;
      diceNumber += num;
    }
    const element = wordsList[diceNumber];
    wordsArray.push(element);
  }

  return wordsArray;
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
