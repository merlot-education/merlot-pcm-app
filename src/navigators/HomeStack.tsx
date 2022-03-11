import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'
import Home from '../screens/Home'
import { HomeStackParams, Screens } from '../types/navigators'

import defaultStackOptions from './defaultStackOptions'

const Stack = createStackNavigator<HomeStackParams>()

const HomeStack: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        ...defaultStackOptions,
      }}
    >
      <Stack.Screen name={Screens.Home} component={Home} />
    </Stack.Navigator>
  )
}

export default HomeStack
