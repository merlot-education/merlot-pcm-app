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
import indyLedgers from '../../configs/ledgers/indy'
import Connect from '../screens/Connect'
import ListContacts from '../screens/ListContacts'
import Scan from '../screens/Scan'
import * as api from '../api'
import ConnectionInvitation from '../screens/ConnectionInvitation'
import MainStack from './MainStack'
import OnboardingStack from './OnboardingStack'

interface Props {
  setAgent: (agent: Agent) => void
}

const RootStack: React.FC<Props> = ({ setAgent }) => {
  const [authenticated, setAuthenticated] = useState(false)

  const initAgent = async (email: string, walletPin: string) => {
    const emailHash = String(md5(email))
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

  return authenticated ? (
    <MainStack />
  ) : (
    <OnboardingStack
      initAgent={initAgent}
      setAuthenticated={setAuthenticated}
    />
  )
}

export default RootStack
