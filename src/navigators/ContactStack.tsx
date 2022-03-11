import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'

import ListContacts from '../screens/ListContacts'
import { ContactStackParams, Screens } from '../types/navigators'

import defaultStackOptions from './defaultStackOptions'

const Stack = createStackNavigator<ContactStackParams>()

const ContactStack: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ ...defaultStackOptions }}>
      <Stack.Screen name={Screens.Contacts} component={ListContacts} />
    </Stack.Navigator>
  )
}

export default ContactStack
