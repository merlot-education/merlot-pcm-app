import React, { useState, useMemo, useEffect, useCallback } from 'react'
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
import { Linking } from 'react-native'
import Config from 'react-native-config'
import { agentDependencies } from '@aries-framework/react-native'
import UserInactivity from 'react-native-user-inactivity'
import Toast from 'react-native-toast-message'
import { useTranslation } from 'react-i18next'
import { useAgent } from '@aries-framework/react-hooks'
import indyLedgers from '../../configs/ledgers/indy'
import MainStack from './MainStack'
import OnboardingStack from './OnboardingStack'
import { MainStackContext } from '../utils/helpers'
import { ToastType } from '../components/toast/BaseToast'
import { Screens } from '../types/navigators'

interface Props {
  setAgent: (agent: Agent) => void
}

const RootStack: React.FC<Props> = ({ setAgent }) => {
  const { t } = useTranslation()
  const [authenticated, setAuthenticated] = useState(false)
  const [deepLinkUrl, setDeepLinkUrl] = useState<string | null>()
  const [active, setActive] = useState(true)
  const { agent } = useAgent()
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
        logger: new ConsoleLogger(LogLevel.trace),
        autoUpdateStorageOnStartup: true,
        connectToIndyLedgersOnStartup: true,
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
    setActive(true)
  }

  const shutDownAgent = useCallback(async () => {
    if (!active) {
      setAuthenticated(false)
      await agent?.shutdown()
      Toast.show({
        type: ToastType.Info,
        text1: t('Toasts.Info'),
        text2: t('Global.UserInactivity'),
      })
    }
  }, [active, agent, t])

  useEffect(() => {
    shutDownAgent()
  }, [shutDownAgent])

  useEffect(() => {
    (async () => {
      const handleDeepLinking = async (url: string) => {
        console.log("handling deep linking ", url);

        setDeepLinkUrl(url);
      }

      Linking.addEventListener('url', ({ url }) => handleDeepLinking(url))
      console.log('==================== DEEP LINKING INIT')
      const initialUrl = await Linking.getInitialURL();
      console.log('initialUrl = ', initialUrl)
      if (initialUrl) {
        handleDeepLinking(initialUrl);
      }
    })()
  }, [])

  const setAuthenticatedValue = useMemo(() => ({ value: setAuthenticated }), [])

  return authenticated ? (
    <UserInactivity
      isActive={active}
      timeForInactivity={300000}
      onAction={isActive => setActive(isActive)}
    >
      <MainStackContext.Provider
        value={{
          setAuthenticated: setAuthenticatedValue,
          deepLinkUrl: deepLinkUrl,
          resetDeepLinkUrl: () => setDeepLinkUrl(null)
        }}
      >
        <MainStack />
      </MainStackContext.Provider>
    </UserInactivity>
  ) : (
    <OnboardingStack
      initAgent={initAgent}
      setAuthenticated={setAuthenticated}
      setAgent={setAgent}
      setActive={setActive}
    />
  )
}

export default RootStack
