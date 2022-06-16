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
import Config from 'react-native-config'
import { agentDependencies } from '@aries-framework/react-native'
import UserInactivity from 'react-native-user-inactivity'
import Toast from 'react-native-toast-message'
import { useTranslation } from 'react-i18next'
import indyLedgers from '../../configs/ledgers/indy'
import MainStack from './MainStack'
import OnboardingStack from './OnboardingStack'
import { MainStackContext } from '../utils/helpers'
import { ToastType } from '../components/toast/BaseToast'

interface Props {
  setAgent: (agent: Agent) => void
}

const RootStack: React.FC<Props> = ({ setAgent }) => {
  const { t } = useTranslation()
  const [authenticated, setAuthenticated] = useState(false)
  const [active, setActive] = useState(true)
  const initAgent = async (email: string, walletPin: string, seed: string) => {
    const newAgent = new Agent(
      {
        label: email, // added email as label
        mediatorConnectionsInvite: Config.MEDIATOR_URL,
        mediatorPickupStrategy: MediatorPickupStrategy.Implicit,
        walletConfig: { id: email, key: walletPin },
        autoAcceptConnections: true,
        publicDidSeed: seed,
        autoAcceptCredentials: AutoAcceptCredential.ContentApproved,
        autoAcceptProofs: AutoAcceptProof.ContentApproved,
        logger: new ConsoleLogger(LogLevel.debug),
        autoUpdateStorageOnStartup: true,
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
    <UserInactivity
      isActive={active}
      timeForInactivity={300000}
      onAction={() => {
        Toast.show({
          type: ToastType.Info,
          text1: t('Toasts.Info'),
          text2: t('Global.UserInactivity'),
        })
        setAuthenticated(false)
        setActive(isActive => !isActive)
      }}
    >
      <MainStackContext.Provider value={setAuthenticatedValue}>
        <MainStack />
      </MainStackContext.Provider>
    </UserInactivity>
  ) : (
    <OnboardingStack
      initAgent={initAgent}
      setAuthenticated={setAuthenticated}
      setAgent={setAgent}
    />
  )
}

export default RootStack
