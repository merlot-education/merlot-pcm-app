/**
 * @format
 */
import 'react-native-gesture-handler'

import { NavigationContainer } from '@react-navigation/native'
import React from 'react'
import { AppRegistry } from 'react-native'

import App from './App'
import { name as appName } from './app.json'

const navigationTheme = {
  dark: false,
  colors: {
    text: 'white',
    border: 'white',
    notification: 'white',
  },
}

const Base = () => {
  return (
    <NavigationContainer theme={navigationTheme}>
      <App />
    </NavigationContainer>
  )
}

AppRegistry.registerComponent(appName, () => Base)
