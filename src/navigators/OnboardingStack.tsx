import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'
import DefaultConnection from '../screens/DefaultConnection'
import GaiaxConsent from '../screens/GaiaxConsent'
import PinCreate from '../screens/PinCreate'
import PinEnter from '../screens/PinEnter'
import Registration from '../screens/Registration'
import Splash from '../screens/Splash'
import Terms from '../screens/Terms'
import VerifyOtp from '../screens/VerifyOtp'
import { Colors } from '../theme/theme'

import { Screens } from '../types/navigators'

import defaultStackOptions from './defaultStackOptions'

const Stack = createStackNavigator()

type OnboardingStackProps = {
  setAuthenticated: React.Dispatch<React.SetStateAction<boolean>>
  initAgent: (email: string, walletPin: string) => void
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
        name={Screens.Terms}
        options={() => ({
          title: 'Terms & Conditions',
          headerTintColor: Colors.white,
          headerShown: true,
          headerLeft: () => false,
          rightLeft: () => false,
        })}
        component={Terms}
      />
      <Stack.Screen name={Screens.Registration} component={Registration} />
      <Stack.Screen name={Screens.VerifyOtp} component={VerifyOtp} />
      <Stack.Screen name={Screens.CreatePin}>
        {props => <PinCreate {...props} initAgent={initAgent} />}
      </Stack.Screen>
      <Stack.Screen name={Screens.DefaultConnection}>
        {props => (
          <DefaultConnection {...props} setAuthenticated={setAuthenticated} />
        )}
      </Stack.Screen>
      {/* <Stack.Screen name={Screens.GaiaxConsent} component={GaiaxConsent} />
      <Stack.Screen name={Screens.DefaultConnection}>
        {props => (
          <DefaultConnection {...props} setAuthenticated={setAuthenticated} />
        )}
      </Stack.Screen> */}
    </Stack.Navigator>
  )
}

export default OnboardingStack
