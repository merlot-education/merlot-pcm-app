import React, { useEffect, useState } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import SplashScreen from 'react-native-splash-screen'
import {
  Agent,
  MediatorPickupStrategy,
  AutoAcceptCredential,
  ConsoleLogger,
  LogLevel,
  WsOutboundTransport,
  HttpOutboundTransport,
} from '@aries-framework/core'
import { agentDependencies } from '@aries-framework/react-native'
import Config from 'react-native-config'
import { Colors } from './src/theme/theme'
import RootStack from './src/navigators/RootStack'
import indyLedgers from './configs/ledgers/indy'

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

  const initAgent = async () => {
    const newAgent = new Agent(
      {
        label: 'New Wallet',
        mediatorConnectionsInvite: Config.MEDIATOR_URL,
        mediatorPickupStrategy: MediatorPickupStrategy.Implicit,
        walletConfig: { id: 'wallet4', key: '123' },
        autoAcceptConnections: true,
        autoAcceptCredentials: AutoAcceptCredential.ContentApproved,
        logger: new ConsoleLogger(LogLevel.trace),
        indyLedgers,
      },
      agentDependencies,
    )

    const wsTransport = new WsOutboundTransport()
    const httpTransport = new HttpOutboundTransport()

    newAgent.registerOutboundTransport(wsTransport)
    newAgent.registerOutboundTransport(httpTransport)

    await newAgent.initialize()
    setAgent(newAgent)
  }
  useEffect(() => {
    // Hide the native splash / loading screen so that our
    // RN version can be displayed.
    SplashScreen.hide()
    initAgent()
  }, [])

  return (
    <NavigationContainer theme={navigationTheme}>
      <RootStack />
    </NavigationContainer>
  )
}

export default App
