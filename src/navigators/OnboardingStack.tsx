import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { Agent } from '@aries-framework/core';
import { useTranslation } from 'react-i18next';
import PinCreate from '../screens/PinCreate';
import Biometric from '../screens/Biometric';
import PinEnter from '../screens/PinEnter';
import Splash from '../screens/Splash';
import Terms from '../screens/Terms';
import Onboarding from '../screens/Onboarding';
import { ColorPallet } from '../theme/theme';

import { OnboardingStackParams, Screens } from '../types/navigators';

import defaultStackOptions from './defaultStackOptions';
import ImportWallet from '../screens/ImportWallet';
import CreateWallet from '../screens/CreateWallet/CreateWallet';
import Initialization from '../screens/Initialization';
import WalletInitialized from '../screens/WalletInitialized';
import SetupDelay from '../screens/SetupDelay';

const Stack = createStackNavigator<OnboardingStackParams>();

type OnboardingStackProps = {
  setAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  initAgent: (guid: string, walletPin: string, seed: string) => void;
  setAgent: (agent: Agent) => void;
  setActive: React.Dispatch<React.SetStateAction<boolean>>;
};

const OnboardingStack: React.FC<OnboardingStackProps> = ({
  setAuthenticated,
  initAgent,
  setAgent,
  setActive,
}) => {
  const { t } = useTranslation();
  return (
    <Stack.Navigator
      initialRouteName={Screens.Splash}
      screenOptions={{
        ...defaultStackOptions,
        headerShown: false,
      }}
    >
      <Stack.Screen name={Screens.Splash} component={Splash} />
      <Stack.Screen
        name={Screens.Onboarding}
        options={() => ({
          title: t<string>('ScreenTitles.Onboarding'),
          headerTintColor: ColorPallet.baseColors.white,
          headerShown: true,
          headerLeft: () => false,
          rightLeft: () => false,
        })}
        component={Onboarding}
      />
      <Stack.Screen
        name={Screens.Terms}
        options={() => ({
          title: t<string>('ScreenTitles.LegalAndPrivacy'),
          headerTintColor: ColorPallet.baseColors.white,
          headerShown: true,
          headerLeft: () => false,
          rightLeft: () => false,
        })}
        component={Terms}
      />
      <Stack.Screen
        name={Screens.CreatePin}
        component={PinCreate}
        initialParams={{ initAgent, setAuthenticated }}
        options={() => ({
          title: t<string>('ScreenTitles.CreatePin'),
          headerTintColor: ColorPallet.baseColors.white,
          headerShown: true,
          headerLeft: () => false,
          rightLeft: () => false,
        })}
      />
      <Stack.Screen
        name={Screens.Biometric}
        component={Biometric}
        initialParams={{ initAgent, setAuthenticated }}
        options={() => ({
          title: t<string>('ScreenTitles.Biometric'),
          headerTintColor: ColorPallet.baseColors.white,
          headerShown: true,
          headerLeft: () => false,
          rightLeft: () => false,
        })}
      />
      <Stack.Screen
        name={Screens.Initialization}
        component={Initialization}
        options={() => ({
          title: t<string>('ScreenTitles.Initialization'),
          headerTintColor: ColorPallet.baseColors.white,
          headerShown: true,
          headerLeft: () => false,
          rightLeft: () => false,
        })}
      />
      <Stack.Screen
        name={Screens.CreateWallet}
        component={CreateWallet}
        initialParams={{ initAgent }}
        options={() => ({
          title: t<string>('ScreenTitles.Initialization'),
          headerTintColor: ColorPallet.baseColors.white,
          headerShown: true,
          headerLeft: () => false,
          rightLeft: () => false,
        })}
      />
      <Stack.Screen
        name={Screens.WalletInitialized}
        component={WalletInitialized}
        initialParams={{ setAuthenticated }}
        options={() => ({
          title: t<string>('ScreenTitles.WalletInitialized'),
          headerTintColor: ColorPallet.baseColors.white,
          headerShown: true,
          headerLeft: () => false,
          rightLeft: () => false,
        })}
      />
      <Stack.Screen
        name={Screens.ImportWallet}
        component={ImportWallet}
        initialParams={{ setAuthenticated, setAgent, setActive }}
        options={() => ({
          title: t<string>('ScreenTitles.ImportWallet'),
          headerTintColor: ColorPallet.baseColors.white,
          headerShown: true,
        })}
      />
      <Stack.Screen
        name={Screens.EnterPin}
        component={PinEnter}
        initialParams={{ initAgent, setAuthenticated }}
        options={() => ({
          title: t<string>('ScreenTitles.EnterPin'),
          headerTintColor: ColorPallet.baseColors.white,
          headerShown: true,
          headerLeft: () => false,
          rightLeft: () => false,
        })}
      />
      <Stack.Screen
        name={Screens.SetupDelay}
        component={SetupDelay}
        options={() => ({
          title: t<string>('ScreenTitles.SetupDelay'),
          headerTintColor: ColorPallet.baseColors.white,
          headerShown: true,
          headerLeft: () => false,
          rightLeft: () => false,
        })}
      />
    </Stack.Navigator>
  );
};

export default OnboardingStack;
