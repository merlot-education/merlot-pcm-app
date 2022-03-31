import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'
import DefaultConnection from '../screens/DefaultConnection'
import PinCreate from '../screens/PinCreate'
import PinEnter from '../screens/PinEnter'
import Registration from '../screens/Registration'
import Splash from '../screens/Splash'
import Terms from '../screens/Terms'
import Onboarding from '../screens/Onboarding'
import VerifyOtp from '../screens/VerifyOtp'
import { ColorPallet } from '../theme/theme'

import { OnboardingStackParams, Screens } from '../types/navigators'

import defaultStackOptions from './defaultStackOptions'

const Stack = createStackNavigator<OnboardingStackParams>()

type OnboardingStackProps = {
  setAuthenticated: React.Dispatch<React.SetStateAction<boolean>>
  initAgent: (email: string, walletPin: string, seed: string) => void
}

const OnboardingStack: React.FC<OnboardingStackProps> = ({
  setAuthenticated,
  initAgent,
}) => {
  return (
    <Stack.Navigator
      initialRouteName={Screens.Splash}
      screenOptions={{ ...defaultStackOptions, headerShown: false }}
    >
      <Stack.Screen name={Screens.Splash} component={Splash} />
      <Stack.Screen
        name={Screens.Onboarding}
        options={() => ({
          title: 'App Introduction',
          headerTintColor: ColorPallet.baseColors.white,
          headerShown: true,
          headerLeft: () => false,
          rightLeft: () => false,
        })}
        component={Onboarding}
      />
      <Stack.Screen
        name={Screens.Terms}
        options={() => ({
          title: 'Terms & Conditions',
          headerTintColor: ColorPallet.baseColors.white,
          headerShown: true,
          headerLeft: () => false,
          rightLeft: () => false,
        })}
        component={Terms}
      />
      <Stack.Screen name={Screens.Registration} component={Registration} />
      <Stack.Screen name={Screens.VerifyOtp} component={VerifyOtp} />
      <Stack.Screen
        name={Screens.CreatePin}
        component={PinCreate}
        initialParams={{ initAgent }}
      />
      <Stack.Screen
        name={Screens.EnterPin}
        component={PinEnter}
        initialParams={{ initAgent, setAuthenticated }}
      />
      <Stack.Screen
        name={Screens.DefaultConnection}
        component={DefaultConnection}
        initialParams={{ setAuthenticated }}
      />
    </Stack.Navigator>
  )
}

export default OnboardingStack
