import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'
import ListCredentials from '../screens/ListCredentials'
import { CredentialStackParams, Screens } from '../types/navigators'

import defaultStackOptions from './defaultStackOptions'

const Stack = createStackNavigator<CredentialStackParams>()

const CredentialStack: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ ...defaultStackOptions }}>
      <Stack.Screen name={Screens.Credentials} component={ListCredentials} />
    </Stack.Navigator>
  )
}

export default CredentialStack
