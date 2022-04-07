export const defaultLanguage = 'en'

export const testIdPrefix = 'com.pcm:id/'

export enum LocalStorageKeys {
  Language = 'language',
  OnboardingCompleteStage = 'onboardingCompleteStage',
}

export enum KeychainStorageKeys {
  Email = 'email',
  Passphrase = 'passphrase',
  mnemonicText = 'mnemonicText',
}

export const dateFormatOptions: {
  year: 'numeric'
  month: 'short'
  day: 'numeric'
} = {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
}
