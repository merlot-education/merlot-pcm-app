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
  Contacts = 'Contacts',
  Settings = 'Settings',
  DefaultConnection = 'DefaultConnection',
  Notifications = 'Notifications',
  CredentialOffer = 'CredentialOffer',
  ProofRequest = 'ProofRequest',
  Language = 'Language',
  ConnectionInvitation = 'ConnectionInvitation',
}

export type OnboardingStackParams = {
  Splash: undefined
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
  }
  EnterPin: {
    initAgent: (email: string, walletPin: string, seed: string) => void
    setAuthenticated: React.Dispatch<React.SetStateAction<boolean>>
  }
  DefaultConnection: {
    setAuthenticated?: React.Dispatch<React.SetStateAction<boolean>>
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
  Contacts: undefined
  'Contact Details': { connectionId: string }
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
}

export enum TabStacks {
  HomeStack = 'Tab Home Stack',
  ContactStack = 'Tab Contact Stack',
  ScanStack = 'Tab Scan Stack',
  CredentialStack = 'Tab Credential Stack',
  SettingsStack = 'Tab Settings Stack',
}

export type TabStackParams = {
  [TabStacks.HomeStack]: NavigatorScreenParams<HomeStackParams>
  [TabStacks.ContactStack]: NavigatorScreenParams<ContactStackParams>
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
  ContactStack = 'Contacts Stack',
}
