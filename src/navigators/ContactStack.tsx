import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'

import ListContacts from '../screens/ListContacts'
import { ContactStackParams, Screens } from '../types/navigators'

import defaultStackOptions from './defaultStackOptions'
import { ColorPallet } from '../theme/theme'

const Stack = createStackNavigator<ContactStackParams>()

const ContactStack: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ ...defaultStackOptions }}>
      <Stack.Screen
        name={Screens.ListContacts}
        component={ListContacts}
        options={() => ({
          title: 'Connection',
          headerTintColor: ColorPallet.baseColors.white,
          headerShown: true,
          headerLeft: () => false,
          rightLeft: () => false,
        })}
      />
    </Stack.Navigator>
  )
}

export default ContactStack
