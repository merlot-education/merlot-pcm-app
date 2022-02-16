import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'

import Terms from '../screens/Terms'

const onboardingStack = () => {
  const Stack = createStackNavigator()

  return (
    <Stack.Navigator initialRouteName="Terms">
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
    </Stack.Navigator>
  )
}

const RootStack: React.FC = () => {
  return onboardingStack()
}

export default RootStack
