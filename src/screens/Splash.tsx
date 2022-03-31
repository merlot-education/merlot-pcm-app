import React, { useMemo, useContext } from 'react'
import { SafeAreaView, StyleSheet } from 'react-native'
import SplashScreen from 'react-native-splash-screen'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { StackScreenProps } from '@react-navigation/stack'
import { Screens, OnboardingStackParams } from '../types/navigators'
import { ColorPallet } from '../theme/theme'
import { LocalStorageKeys } from '../constants'
import { Context } from '../store/Store'
import { Onboarding } from '../types/states'
import { DispatchAction } from '../store/reducer'

type SplashProps = StackScreenProps<OnboardingStackParams, Screens.Splash>

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: ColorPallet.grayscale.white,
  },
})

const onboardingComplete = (state: Onboarding): boolean => {
  return (
    state.DidCompleteTutorial && state.DidAgreeToTerms && state.DidCreatePIN
  )
}

const resumeOnboardingAt = (state: Onboarding): Screens => {
  if (
    state.DidCompleteTutorial &&
    state.DidAgreeToTerms &&
    !state.DidCreatePIN
  ) {
    return Screens.CreatePin
  }

  if (state.DidCompleteTutorial && !state.DidAgreeToTerms) {
    return Screens.Terms
  }

  return Screens.Onboarding
}

const Splash: React.FC<SplashProps> = ({ navigation }) => {
  const [, dispatch] = useContext(Context)
  useMemo(() => {
    async function init() {
      try {
        // await AsyncStorage.removeItem(LocalStorageKeys.Onboarding)
        const data = await AsyncStorage.getItem(LocalStorageKeys.Onboarding)
        console.log('data is', data)
        if (data) {
          const dataAsJSON = JSON.parse(data) as Onboarding
          dispatch({
            type: DispatchAction.SetOnboardingState,
            payload: [dataAsJSON],
          })
          console.log(dataAsJSON)
          if (onboardingComplete(dataAsJSON)) {
            SplashScreen.hide()
            navigation.navigate(Screens.EnterPin)
            return
          }

          // If onboarding was interrupted we need to pickup from where we left off.
          const destination = resumeOnboardingAt(dataAsJSON)
          SplashScreen.hide()
          navigation.navigate({ name: destination })
          return
        }

        // We have no onboarding state, starting from step zero.
        console.log('state is')
        SplashScreen.hide()
        navigation.navigate(Screens.Onboarding)
      } catch (error) {
        // TODO:(jl)
      }
    }
    init()
  }, [dispatch, navigation])

  return <SafeAreaView style={styles.container} />
}

export default Splash
