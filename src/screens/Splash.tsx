import React, { useEffect } from 'react'
import { SafeAreaView, StyleSheet } from 'react-native'
import SplashScreen from 'react-native-splash-screen'
import ReactNativeBiometrics from 'react-native-biometrics'
import { Screens } from '../types/navigators'
import { Colors } from '../theme/theme'
import { getValueKeychain } from '../utils/keychain'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
})

interface SplashProps {
  navigation: any
}

const Splash: React.FC<SplashProps> = ({ navigation }) => {
  const checkStack = async () => {
    const keychainEntry = await getValueKeychain({
      service: 'passcode',
    })
    ReactNativeBiometrics.biometricKeysExist().then(resultObject => {
      const { keysExist } = resultObject
      if (keysExist) {
        SplashScreen.hide()
        navigation.navigate(Screens.EnterPin, { biometric: true })
      }
    })
    if (keychainEntry) {
      SplashScreen.hide()
      navigation.navigate(Screens.EnterPin, { biometric: false })
    } else {
      SplashScreen.hide()
      navigation.navigate(Screens.Terms)
    }
  }

  useEffect(() => {
    checkStack()
  })

  return <SafeAreaView style={styles.container} />
}

export default Splash
