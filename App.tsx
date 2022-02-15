import { default as React, useEffect } from 'react'
// import SplashScreen from 'react-native-splash-screen'

import RootStack from './App/navigators/RootStack'

const App = () => {
  // useEffect(() => {
  //   // Hide the native splash / loading screen so that our
  //   // RN version can be displayed.
  //   SplashScreen.hide()
  // }, [])

  return <RootStack />
}

export default App
