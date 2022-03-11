import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'

import Settings from '../screens/Settings'
import ChangePin from '../screens/ChangePin'
import { Screens } from '../types/navigators'

import defaultStackOptions from './defaultStackOptions'

const SettingStack: React.FC = () => {
  const Stack = createStackNavigator()

  return (
    <Stack.Navigator
      screenOptions={{ ...defaultStackOptions, headerShown: false }}
    >
      <Stack.Screen name={Screens.Settings} component={Settings} />
      <Stack.Screen name={Screens.ChangePin} component={ChangePin} />
    </Stack.Navigator>
  )
}

export default SettingStack
