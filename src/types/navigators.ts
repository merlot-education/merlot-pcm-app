import { NavigatorScreenParams } from '@react-navigation/core'

export enum Screens {
  Onboarding = 'Onboarding',
  Terms = 'Terms',
  Registration = 'Registration',
  VerifyOtp = 'VerifyOtp',
  CreatePin = 'Create 6-Digit Pin',
  Splash = 'Splash',
  EnterPin = 'Enter Pin',
  Home = 'Home',
  Connect = 'Connect',
  Consent = 'Consent',
  ListContacts = 'ListContacts',
  Scan = 'Scan',
  ChangePin = 'ChangePin',
  Credentials = 'Credentials',
  Contacts = 'Contacts',
  Settings = 'Settings',
  GaiaxConsent = 'GaiaxConsent',
  DefaultConnection = 'DefaultConnection',
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
  'Credential Details': { credentialId: string }
}

export type HomeStackParams = {
  Home: undefined
  Notifications: undefined
  'Credential Offer': { credentialId: string }
  'Proof Request': { proofId: string }
}

export type ScanStackParams = {
  Scan: undefined
}

export type SettingStackParams = {
  Settings: undefined
  Language: undefined
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
  [TabStacks.SettingsStack]: NavigatorScreenParams<CredentialStackParams>
}

export enum Stacks {
  TabStack = 'Tab Stack',
  HomeStack = 'Home Stack',
  ConnectStack = 'Connect Stack',
  CredentialStack = 'Credentials Stack',
  SettingStack = 'Settings Stack',
  ContactStack = 'Contacts Stack',
}
