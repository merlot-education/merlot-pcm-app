import React, { useEffect } from 'react'
import { SafeAreaView, StyleSheet } from 'react-native'
import SplashScreen from 'react-native-splash-screen'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Screens } from '../types/navigators'
import { Colors } from '../theme/theme'
import { LocalStorageKeys } from '../constants'

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
    const onboardingCompleteStage = await AsyncStorage.getItem(
      LocalStorageKeys.OnboardingCompleteStage,
    )
    if (onboardingCompleteStage === 'true') {
      SplashScreen.hide()
      navigation.navigate(Screens.EnterPin)
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
