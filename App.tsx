import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Agent } from '@aries-framework/core';
import AntDesignProvider from '@ant-design/react-native/lib/provider';
import AgentProvider from '@aries-framework/react-hooks';
import Toast from 'react-native-toast-message';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Platform } from 'react-native';
import { ColorPallet, customTheme } from './src/theme/theme';
import RootStack from './src/navigators/RootStack';
import { initStoredLanguage } from './src/localization';
import toastConfig from './src/components/toast/ToastConfig';

const navigationTheme = {
  dark: false,
  colors: {
    primary: ColorPallet.brand.primary,
    background: ColorPallet.grayscale.white,
    card: ColorPallet.brand.primary,
    text: ColorPallet.grayscale.white,
    border: ColorPallet.grayscale.white,
    notification: ColorPallet.grayscale.white,
  },
};

const App = () => {
  const [agent, setAgent] = useState<Agent | undefined>(undefined);

  initStoredLanguage();

  const setupAgent = (agent: Agent) => {
    setAgent(agent);
  };

  return (
    <SafeAreaProvider>
      <AntDesignProvider theme={customTheme}>
        <AgentProvider agent={agent}>
          <NavigationContainer theme={navigationTheme}>
            <RootStack setAgent={setupAgent} />
            <Toast
              topOffset={Platform.OS === 'android' ? 5 : 50}
              config={toastConfig}
            />
          </NavigationContainer>
        </AgentProvider>
      </AntDesignProvider>
    </SafeAreaProvider>
  );
};

export default App;
