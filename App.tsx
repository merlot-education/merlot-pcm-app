import React, { useEffect, useState } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { Agent } from '@aries-framework/core'
import { Provider as AntDesignProvider } from '@ant-design/react-native'
import SplashScreen from 'react-native-splash-screen'
import AgentProvider from '@aries-framework/react-hooks'
import { Colors, customTheme } from './src/theme/theme'
import RootStack from './src/navigators/RootStack'
import { initStoredLanguage } from './src/localization'

const navigationTheme = {
  dark: false,
  colors: {
    primary: Colors.primary,
    background: Colors.background,
    card: Colors.primary,
    text: 'white',
    border: 'white',
    notification: 'white',
  },
}

const App = () => {
  const [agent, setAgent] = useState<Agent | undefined>(undefined)

  initStoredLanguage()

  const setupAgent = (agent: Agent) => {
    setAgent(agent)
  }

  useEffect(() => {
    // Hide the native splash / loading screen so that our
    // RN version can be displayed.
    SplashScreen.hide()
  }, [])

  return (
    <AntDesignProvider theme={customTheme}>
      <AgentProvider agent={agent}>
        <NavigationContainer theme={navigationTheme}>
          <RootStack setAgent={setupAgent} />
        </NavigationContainer>
      </AgentProvider>
    </AntDesignProvider>
  )
}

export default App
