import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'

import Settings from '../screens/Settings'

import { Screens, SettingStackParams } from '../types/navigators'

import defaultStackOptions from './defaultStackOptions'

const Stack = createStackNavigator<SettingStackParams>()

const SettingStack: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ ...defaultStackOptions }}>
      <Stack.Screen name={Screens.Settings} component={Settings} />
    </Stack.Navigator>
  )
}

export default SettingStack
