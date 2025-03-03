import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  Agent,
  AutoAcceptCredential,
  ConsoleLogger,
  HttpOutboundTransport,
  LogLevel,
  MediatorPickupStrategy,
  WsOutboundTransport,
  AutoAcceptProof,
} from '@aries-framework/core';
import { Linking } from 'react-native';
import Config from 'react-native-config';
import uuid from 'react-native-uuid';
import { agentDependencies } from '@aries-framework/react-native';
import UserInactivity from 'react-native-user-inactivity';
import Toast from 'react-native-toast-message';
import { useTranslation } from 'react-i18next';
import { useAgent } from '@aries-framework/react-hooks';
import indyLedgers from '../../configs/ledgers/indy';
import MainStack from './MainStack';
import OnboardingStack from './OnboardingStack';
import { MainStackContext } from '../utils/helpers';
import { ToastType } from '../components/toast/BaseToast';
import { getValueFromKeychain, saveValueInKeychain } from "../utils/generic";
import { KeychainStorageKeys } from "../constants";

interface Props {
  setAgent: (agent: Agent) => void;
}

const RootStack: React.FC<Props> = ({ setAgent }) => {
  const { t } = useTranslation();
  const [uuidInitialized, setUuidInitialized] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [deepLinkUrl, setDeepLinkUrl] = useState<string | null>();
  const [active, setActive] = useState(true);
  const { agent } = useAgent();

  useEffect(() => {
    (async () => {
      const guid = await getValueFromKeychain(KeychainStorageKeys.GUID);
      if (!guid) {
        const guid = uuid.v4() as string;

        await saveValueInKeychain(KeychainStorageKeys.GUID, guid, 'GUID');
      }
      setUuidInitialized(true);
    })();
  }, [authenticated]);
  const initAgent = async (guid: string, walletPin: string, seed: string) => {
    const newAgent = new Agent(
      {
        label: guid, // added guid as label
        mediatorConnectionsInvite: Config.MEDIATOR_URL,
        mediatorPickupStrategy: MediatorPickupStrategy.Implicit,
        walletConfig: { id: guid, key: walletPin },
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
    );

    const wsTransport = new WsOutboundTransport();
    const httpTransport = new HttpOutboundTransport();

    newAgent.registerOutboundTransport(wsTransport);
    newAgent.registerOutboundTransport(httpTransport);

    await newAgent.initialize();
    setAgent(newAgent);
    setActive(true);
  };

  const shutDownAgent = useCallback(async () => {
    if (!active) {
      setAuthenticated(false);
      await agent?.shutdown();
      Toast.show({
        type: ToastType.Info,
        text1: t<string>('Toasts.Info'),
        text2: t<string>('Global.UserInactivity'),
      });
    }
  }, [active, agent, t]);

  useEffect(() => {
    shutDownAgent();
  }, [shutDownAgent]);

  useEffect(() => {
    (async () => {
      const handleDeepLinking = async (url: string) => {
        setDeepLinkUrl(url);
      };

      Linking.addEventListener('url', ({ url }) => handleDeepLinking(url));
      const initialUrl = await Linking.getInitialURL();
      if (initialUrl) {
        handleDeepLinking(initialUrl);
      }
    })();
  }, []);

  const mainStackProviderValue = useMemo(
    () => ({
      setAuthenticated,
      deepLinkUrl,
      resetDeepLinkUrl: () => setDeepLinkUrl(null),
    }),
    [setAuthenticated, deepLinkUrl, setDeepLinkUrl],
  );

  return authenticated && uuidInitialized ? (
    <UserInactivity
      isActive={active}
      timeForInactivity={300000}
      onAction={isActive => setActive(isActive)}
    >
      <MainStackContext.Provider value={mainStackProviderValue}>
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
  );
};

export default RootStack;
