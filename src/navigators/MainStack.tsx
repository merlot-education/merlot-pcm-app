import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'
import Connect from '../screens/Connect'
import Home from '../screens/Home'
import { Screens, Stacks } from '../types/navigators'

import defaultStackOptions from './defaultStackOptions'
import TabStack from './TabStack'

const Stack = createStackNavigator()

type Prop = {
  setAuthenticated: React.Dispatch<React.SetStateAction<boolean>>
}

const MainStack: React.FC<Prop> = ({ setAuthenticated }) => {
  return (
    <Stack.Navigator
      screenOptions={{ ...defaultStackOptions, headerShown: false }}
    >
      <Stack.Screen name={Stacks.TabStack}>
        {props => <TabStack {...props} setAuthenticated={setAuthenticated} />}
      </Stack.Screen>
      <Stack.Screen name={Screens.Home} component={Home} />
      <Stack.Screen name={Screens.Connect} component={Connect} />
    </Stack.Navigator>
  )
}

export default MainStack
