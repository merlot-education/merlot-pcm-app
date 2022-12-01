import Keychain from 'react-native-keychain';

const setValueKeychain = async (
  username: string,
  password: string,
  service: any,
) => {
  await Keychain.setGenericPassword(username, password, service);
};

const getValueKeychain = async (service: any) => {
  const credentials = await Keychain.getGenericPassword(service);
  return credentials;
};

export { setValueKeychain, getValueKeychain };
