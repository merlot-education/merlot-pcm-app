import * as Keychain from 'react-native-keychain'

const setValueKeychain = async (username: string, password: string) => {
  await Keychain.setGenericPassword(username, password)
}

const getValueKeychain = async () => {
  const credentials = await Keychain.getGenericPassword()
  return credentials
}

export { setValueKeychain, getValueKeychain }
