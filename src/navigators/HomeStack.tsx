import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { useTranslation } from 'react-i18next';
import Home from '../screens/Home';
import { HomeStackParams, Screens } from '../types/navigators';
import ListNotifications from '../screens/ListNotifications';
import CredentialOffer from '../screens/CredentialOffer';
import defaultStackOptions from './defaultStackOptions';
import ProofRequest from '../screens/ProofRequest';

const Stack = createStackNavigator<HomeStackParams>();

const HomeStack: React.FC = () => {
  const { t } = useTranslation();
  return (
    <Stack.Navigator
      screenOptions={{
        ...defaultStackOptions,
      }}
    >
      <Stack.Screen
        name={Screens.Home}
        component={Home}
        options={() => ({
          title: t<string>('ScreenTitles.Home'),
        })}
      />
      <Stack.Screen
        name={Screens.Notifications}
        component={ListNotifications}
        options={() => ({
          title: t<string>('ScreenTitles.Notifications'),
        })}
      />
      <Stack.Screen
        name={Screens.CredentialOffer}
        component={CredentialOffer}
        options={() => ({
          title: t<string>('ScreenTitles.CredentialOffer'),
        })}
      />
      <Stack.Screen
        name={Screens.ProofRequest}
        component={ProofRequest}
        options={() => ({
          title: t<string>('ScreenTitles.ProofRequest'),
        })}
      />
    </Stack.Navigator>
  );
};

export default HomeStack;
