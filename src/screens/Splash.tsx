import { useNavigation } from '@react-navigation/core'
import React, { useEffect } from 'react'
import { SafeAreaView, StyleSheet } from 'react-native'
import * as Keychain from 'react-native-keychain'
import SplashScreen from 'react-native-splash-screen'
import Screens from '../utils/constants'
import { Colors } from '../theme/theme'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
})

const Splash: React.FC = () => {
  const nav = useNavigation()

  const checkStack = async () => {
    const keychainEntry = await Keychain.getGenericPassword({
      service: 'passcode',
    })
    if (keychainEntry) {
      SplashScreen.hide()
      nav.navigate(Screens.EnterPin)
    } else {
      SplashScreen.hide()
      nav.navigate(Screens.Terms)
    }
  }

  useEffect(() => {
    checkStack()
  })

  return <SafeAreaView style={styles.container} />
}

export default Splash
