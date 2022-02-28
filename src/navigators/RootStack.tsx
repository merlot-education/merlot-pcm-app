import { createStackNavigator } from '@react-navigation/stack'
import React, { useState } from 'react'

import Screens from '../utils/constants'
import PinCreate from '../screens/PinCreate'
import PinEnter from '../screens/PinEnter'
import Splash from '../screens/Splash'
import Terms from '../screens/Terms'
import Home from '../screens/Home'
import { Colors } from '../theme/theme'

import defaultStackOptions from './defaultStackOptions'

const RootStack: React.FC = () => {
  const [authenticated, setAuthenticated] = useState(false)

  const mainStack = () => {
    const Stack = createStackNavigator()

    return (
      <Stack.Navigator
        initialRouteName={Screens.Splash}
        screenOptions={{ ...defaultStackOptions, headerShown: false }}
      >
        <Stack.Screen name={Screens.Home} component={Home} />
      </Stack.Navigator>
    )
  }

  const onboardingStack = setAuthenticated => {
    const Stack = createStackNavigator()

    return (
      <Stack.Navigator
        initialRouteName={Screens.Splash}
        screenOptions={{ ...defaultStackOptions, headerShown: false }}
      >
        <Stack.Screen name={Screens.Splash} component={Splash} />
        <Stack.Screen
          name={Screens.Terms}
          options={() => ({
            title: 'Terms & Conditions',
            headerTintColor: Colors.white,
            headerShown: true,
            headerLeft: () => false,
            rightLeft: () => false,
          })}
          component={Terms}
        />
        <Stack.Screen name={Screens.CreatePin}>
          {props => (
            <PinCreate {...props} setAuthenticated={setAuthenticated} />
          )}
        </Stack.Screen>
        <Stack.Screen name={Screens.EnterPin}>
          {props => <PinEnter {...props} setAuthenticated={setAuthenticated} />}
        </Stack.Screen>
      </Stack.Navigator>
    )
  }

  return authenticated ? mainStack() : onboardingStack(setAuthenticated)
}

export default RootStack
