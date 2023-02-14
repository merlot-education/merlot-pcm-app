import { Agent } from '@aries-framework/core';
import { NavigatorScreenParams } from '@react-navigation/core';

export enum Screens {
  Onboarding = 'Onboarding',
  Terms = 'Terms',
  CreatePin = 'CreatePin',
  Splash = 'Splash',
  EnterPin = 'EnterPin',
  Initialization = 'Initialization',
  Home = 'Home',
  Connect = 'Connect',
  Consent = 'Consent',
  ListContacts = 'ListContacts',
  Scan = 'Scan',
  ChangePin = 'ChangePin',
  Credentials = 'Credentials',
  CredentialDetails = 'Credential Details',
  Settings = 'Settings',
  Notifications = 'Notifications',
  CredentialOffer = 'CredentialOffer',
  ProofRequest = 'ProofRequest',
  Language = 'Language',
  ConnectionInvitation = 'ConnectionInvitation',
  ProofRequestAttributeDetails = 'ProofRequestAttributeDetails',
  ExportWallet = 'ExportWallet',
  ImportWallet = 'ImportWallet',
  LegalAndPrivacy = 'LegalAndPrivacy',
  ContactDetails = 'ConnectionDetails',
  ViewMnemonic = 'ViewMnemonic',
  CreateWallet = 'CreateWallet',
  Biometric = 'Biometric',
  WalletInitialized = 'WalletInitialized',
  SetupDelay = 'SetupDelay',
}

export type OnboardingStackParams = {
  [Screens.Splash]: undefined;
  [Screens.Onboarding]: undefined;
  [Screens.Terms]: undefined;
  [Screens.Initialization]: undefined;
  [Screens.CreatePin]: {
    initAgent: (guid: string, walletPin: string, seed: string) => void;
    setAuthenticated?: React.Dispatch<React.SetStateAction<boolean>>;
  };
  [Screens.Biometric]: {
    initAgent?: (guid: string, walletPin: string, seed: string) => void;
    setAuthenticated?: React.Dispatch<React.SetStateAction<boolean>>;
  };
  [Screens.ImportWallet]: {
    setAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
    setAgent: (agent: Agent) => void;
    setActive: React.Dispatch<React.SetStateAction<boolean>>;
  };
  [Screens.EnterPin]: {
    initAgent: (guid: string, walletPin: string, seed: string) => void;
    setAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  };
  [Screens.CreateWallet]: {
    initAgent: (guid: string, walletPin: string, seed: string) => void;
  };
  [Screens.WalletInitialized]: {
    setAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  };
  [Screens.SetupDelay]: undefined;
};

export type MainStackParams = {
  [Stacks.TabStack]: undefined;
  [Screens.Home]: undefined;
  [Screens.Scan]: undefined;
  [Screens.ListContacts]: undefined;
  [Screens.ConnectionInvitation]: undefined;
};

export type AuthenticateStackParams = {
  [Screens.EnterPin]: {
    initAgent: (guid: string, walletPin: string, seed: string) => void;
    setAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  };
};

export type ContactStackParams = {
  [Screens.ListContacts]: undefined;
  [Screens.ContactDetails]: { connectionId: string };
};

export type CredentialStackParams = {
  [Screens.Credentials]: undefined;
  [Screens.CredentialDetails]: { credentialId: string };
};

export type HomeStackParams = {
  [Screens.Home]: undefined;
  [Screens.Notifications]: undefined;
  [Screens.CredentialOffer]: { credentialId: string };
  [Screens.ProofRequest]: { proofId: string };
  [Screens.ProofRequestAttributeDetails]: {
    proofId: string;
    attributeName: string;
  };
};

export type ScanStackParams = {
  [Screens.Scan]: undefined;
  [Screens.ConnectionInvitation]: undefined;
  [Screens.ListContacts]: undefined;
};

export type SettingStackParams = {
  [Screens.Settings]: undefined;
  [Screens.Language]: undefined;
  [Screens.ChangePin]: undefined;
  [Screens.ExportWallet]: undefined;
  [Screens.ViewMnemonic]: undefined;
  [Screens.LegalAndPrivacy]: undefined;
};

export enum TabStacks {
  HomeStack = 'Tab Home Stack',
  ConnectionStack = 'Tab Connection Stack',
  ScanStack = 'Tab Scan Stack',
  CredentialStack = 'Tab Credential Stack',
  SettingsStack = 'Tab Settings Stack',
}

export type TabStackParams = {
  [TabStacks.HomeStack]: NavigatorScreenParams<HomeStackParams>;
  [TabStacks.ConnectionStack]: NavigatorScreenParams<ContactStackParams>;
  [TabStacks.ScanStack]: NavigatorScreenParams<ScanStackParams>;
  [TabStacks.CredentialStack]: NavigatorScreenParams<CredentialStackParams>;
  [TabStacks.SettingsStack]: NavigatorScreenParams<SettingStackParams>;
};

export enum Stacks {
  TabStack = 'Tab Stack',
  HomeStack = 'Home Stack',
  ConnectStack = 'Connect Stack',
  CredentialStack = 'Credentials Stack',
  ScanStack = 'Scan Stack',
  SettingStack = 'Settings Stack',
  ConnectionStack = 'Connection Stack',
}
