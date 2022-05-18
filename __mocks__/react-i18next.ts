const mockT = jest.fn((key: string) => key)
const useTranslation = jest.fn().mockReturnValue({ t: mockT })
const initReactI18next = {
  type: '3rdParty',
  init: jest.fn(),
}

export { useTranslation, initReactI18next }