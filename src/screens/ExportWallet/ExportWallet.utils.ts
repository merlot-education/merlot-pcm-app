import { argon2 } from 'react-native-argon2'
import { KeychainStorageKeys, salt } from '../../constants'
import { getValueKeychain } from '../../utils/keychain'

const authenticateUser = args => {
  const res = args.reduce((prev, curr) => {
    if (prev.trim() === curr.trim()) return true
    return false
  })
  return res
}

export default authenticateUser
