import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'
import Onboarding from '../screens/Onboarding'

import Terms from '../screens/Terms'
import PinCreate from '../screens/PinCreate'

const onboardingStack = () => {
  const Stack = createStackNavigator()

  return (
    <Stack.Navigator initialRouteName="Onboarding">
      <Stack.Screen
        name="Terms"
        options={() => ({
          title: 'Terms & Conditions',
          headerShown: true,
          headerLeft: () => false,
          rightLeft: () => false,
        })}
        component={Terms}
      />
      <Stack.Screen
        name="Onboarding"
        options={() => ({
          title: 'Onboarding',
          headerShown: true,
          headerLeft: () => false,
          rightLeft: () => false,
        })}
        component={Onboarding}
      />
      <Stack.Screen
        name="PinCreate"
        options={() => ({
          title: 'Pin Create',
          headerShown: true,
          headerLeft: () => false,
          rightLeft: () => false,
        })}
        component={PinCreate}
      />
    </Stack.Navigator>
  )
}

const RootStack: React.FC = () => {
  return onboardingStack()
}

export default RootStack
