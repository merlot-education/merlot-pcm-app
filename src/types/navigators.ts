import { NavigatorScreenParams } from '@react-navigation/core'

export enum Screens {
  Onboarding = 'Onboarding',
  Terms = 'Terms',
  Registration = 'Registration',
  VerifyOtp = 'VerifyOtp',
  CreatePin = 'CreatePin',
  Splash = 'Splash',
  EnterPin = 'EnterPin',
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
  ContactDetails = 'ConnectionDetails',
  ViewMnemonic = 'ViewMnemonic',
  CreateWallet = 'CreateWallet',
}

export type OnboardingStackParams = {
  Splash: undefined
  Onboarding: undefined
  Terms: undefined
  Registration: { forgotPin: boolean }
  VerifyOtp: {
    email: string
    forgotPin: boolean
    otpId: string
  }
  CreatePin: {
    initAgent?: (email: string, walletPin: string, seed: string) => void
    forgotPin: boolean
    setAuthenticated?: React.Dispatch<React.SetStateAction<boolean>>
  }
  ImportWallet: {
    initAgent: (email: string, walletPin: string, seed: string) => void
    setAuthenticated: React.Dispatch<React.SetStateAction<boolean>>
  }
  EnterPin: {
    initAgent: (email: string, walletPin: string, seed: string) => void
    setAuthenticated: React.Dispatch<React.SetStateAction<boolean>>
  }
  CreateWallet: {
    initAgent: (email: string, walletPin: string, seed: string) => void
    setAuthenticated: React.Dispatch<React.SetStateAction<boolean>>
  }
}

export type MainStackParams = {
  TabStack: undefined
  Home: undefined
  Connect: undefined
  ListContacts: undefined
}

export type AuthenticateStackParams = {
  'Enter Pin': { setAuthenticated: (auth: boolean) => void }
}

export type ContactStackParams = {
  ListContacts: undefined
  [Screens.ContactDetails]: { connectionId: string }
}

export type CredentialStackParams = {
  Credentials: undefined
  [Screens.CredentialDetails]: { credentialId: string }
}

export type HomeStackParams = {
  Home: undefined
  Notifications: undefined
  CredentialOffer: { credentialId: string }
  ProofRequest: { proofId: string }
  ProofRequestAttributeDetails: { proofId: string; attributeName: string }
}

export type ScanStackParams = {
  Scan: undefined
  ConnectionInvitation: undefined
  ListContacts: undefined
}

export type SettingStackParams = {
  Settings: undefined
  Language: undefined
  ChangePin: undefined
  ExportWallet: undefined
  ViewMnemonic: undefined
}

export enum TabStacks {
  HomeStack = 'Tab Home Stack',
  ConnectionStack = 'Tab Connection Stack',
  ScanStack = 'Tab Scan Stack',
  CredentialStack = 'Tab Credential Stack',
  SettingsStack = 'Tab Settings Stack',
}

export type TabStackParams = {
  [TabStacks.HomeStack]: NavigatorScreenParams<HomeStackParams>
  [TabStacks.ConnectionStack]: NavigatorScreenParams<ContactStackParams>
  [TabStacks.ScanStack]: NavigatorScreenParams<ScanStackParams>
  [TabStacks.CredentialStack]: NavigatorScreenParams<CredentialStackParams>
  [TabStacks.SettingsStack]: NavigatorScreenParams<SettingStackParams>
}

export enum Stacks {
  TabStack = 'Tab Stack',
  HomeStack = 'Home Stack',
  ConnectStack = 'Connect Stack',
  CredentialStack = 'Credentials Stack',
  ScanStack = 'Scan Stack',
  SettingStack = 'Settings Stack',
  ConnectionStack = 'Connection Stack',
}
