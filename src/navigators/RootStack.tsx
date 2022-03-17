import React, { useState, useMemo } from 'react'
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
import MainStack from './MainStack'
import OnboardingStack from './OnboardingStack'
import { MainStackContext } from '../utils/helpers'

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
        walletConfig: { id: 'email', key: walletPin },
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

  const setAuthenticatedValue = useMemo(() => ({ value: setAuthenticated }), [])
  return authenticated ? (
    <MainStackContext.Provider value={setAuthenticatedValue}>
      <MainStack />
    </MainStackContext.Provider>
  ) : (
    <OnboardingStack
      initAgent={initAgent}
      setAuthenticated={setAuthenticated}
    />
  )
}

export default RootStack
