import { createStackNavigator } from '@react-navigation/stack'
import React, { useState } from 'react'
import {
  Agent,
  AutoAcceptCredential,
  ConsoleLogger,
  HttpOutboundTransport,
  LogLevel,
  MediatorPickupStrategy,
  WsOutboundTransport,
  AutoAcceptProof,
} from '@aries-framework/core'
import md5 from 'md5'
import Config from 'react-native-config'
import { agentDependencies } from '@aries-framework/react-native'
import Screens from '../utils/constants'
import Registration from '../screens/Registration'
import VerifyOtp from '../screens/VerifyOtp'
import PinCreate from '../screens/PinCreate'
import PinEnter from '../screens/PinEnter'
import Splash from '../screens/Splash'
import Terms from '../screens/Terms'
import Home from '../screens/Home'
import { Colors } from '../theme/theme'

import defaultStackOptions from './defaultStackOptions'
import indyLedgers from '../../configs/ledgers/indy'
import Connect from '../screens/Connect'
import ListContacts from '../screens/ListContacts'
import Scan from '../screens/Scan'
import * as api from '../api'

interface Props {
  setAgent: (agent: Agent) => void
}

const RootStack: React.FC<Props> = ({ setAgent }) => {
  const [authenticated, setAuthenticated] = useState(false)

  const initAgent = async (email: string, walletPin: string) => {
    const emailHash = md5(email)
    const newAgent = new Agent(
      {
        label: email, // added email as label
        mediatorConnectionsInvite: Config.MEDIATOR_URL,
        mediatorPickupStrategy: MediatorPickupStrategy.Implicit,
        walletConfig: { id: email, key: walletPin },
        autoAcceptConnections: true,
        publicDidSeed: emailHash,
        autoAcceptCredentials: AutoAcceptCredential.ContentApproved,
        autoAcceptProofs: AutoAcceptProof.ContentApproved,
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

  const mainStack = () => {
    const Stack = createStackNavigator()

    return (
      <Stack.Navigator
        initialRouteName={Screens.Splash}
        screenOptions={{ ...defaultStackOptions, headerShown: false }}
      >
        <Stack.Screen name={Screens.Home} component={Home} />
        <Stack.Screen name={Screens.Scan} component={Scan} />
        <Stack.Screen name={Screens.Connect} component={Connect} />
        <Stack.Screen name={Screens.ListContacts} component={ListContacts} />
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
        <Stack.Screen name={Screens.Registration} component={Registration} />
        <Stack.Screen name={Screens.VerifyOtp} component={VerifyOtp} />
        <Stack.Screen name={Screens.CreatePin}>
          {props => (
            <PinCreate
              {...props}
              setAuthenticated={setAuthenticated}
              initAgent={initAgent}
            />
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
