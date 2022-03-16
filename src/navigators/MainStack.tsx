import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'
import ChangePin from '../screens/ChangePin'
import Connect from '../screens/Connect'
import Home from '../screens/Home'
import { Screens, Stacks } from '../types/navigators'

import defaultStackOptions from './defaultStackOptions'
import TabStack from './TabStack'

const Stack = createStackNavigator()

const MainStack: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{ ...defaultStackOptions, headerShown: false }}
    >
      <Stack.Screen name={Stacks.TabStack} component={TabStack} />
      <Stack.Screen name={Screens.Home} component={Home} />
      <Stack.Screen name={Screens.Connect} component={Connect} />
      <Stack.Screen
        name={Screens.ChangePin}
        component={ChangePin}
        options={{ headerShown: true }}
      />
    </Stack.Navigator>
  )
}

export default MainStack
