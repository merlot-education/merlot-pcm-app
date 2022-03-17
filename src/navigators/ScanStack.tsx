import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'
import Scan from '../screens/Scan'
import { ScanStackParams, Screens } from '../types/navigators'

import defaultStackOptions from './defaultStackOptions'

const Stack = createStackNavigator<ScanStackParams>()

const ScanStack: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        ...defaultStackOptions,
      }}
    >
      <Stack.Screen name={Screens.Scan} component={Scan} />
    </Stack.Navigator>
  )
}

export default ScanStack
