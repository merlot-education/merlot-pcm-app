import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'
import Scan from '../screens/Scan'
import ConnectionInvitation from '../screens/ConnectionInvitation'
import { ScanStackParams, Screens } from '../types/navigators'

import defaultStackOptions from './defaultStackOptions'
import ListContacts from '../screens/ListContacts'

const Stack = createStackNavigator<ScanStackParams>()

const ScanStack: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        ...defaultStackOptions,
      }}
    >
      <Stack.Screen name={Screens.Scan} component={Scan} />
      <Stack.Screen
        name={Screens.ConnectionInvitation}
        component={ConnectionInvitation}
      />
      <Stack.Screen name={Screens.ListContacts} component={ListContacts} />
    </Stack.Navigator>
  )
}

export default ScanStack
