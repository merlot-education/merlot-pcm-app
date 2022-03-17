export const defaultLanguage = 'en'

export enum LocalStorageKeys {
  Language = 'language',
  OnboardingCompleteStage = 'onboardingCompleteStage',
}

export enum KeychainStorageKeys {
  Email = 'email',
  Passphrase = 'passphrase',
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
