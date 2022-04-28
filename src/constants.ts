export const defaultLanguage = 'en'

export const testIdPrefix = 'com.pcm:id/'

export const EMAIL_REGEX =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

export const salt =
  '1234567891011121314151617181920212223242526272829303132333435363'

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
