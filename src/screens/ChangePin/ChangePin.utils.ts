import { Alert } from 'react-native'
import { getValueKeychain, setValueKeychain } from '../../utils/keychain'

export const getValueFromKeychain = async (key: string) => {
  const data = await getValueKeychain({
    service: key,
  })
  return data
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
