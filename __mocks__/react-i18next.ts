const mockT = jest.fn((key: string) => key)
const useTranslation = jest.fn().mockReturnValue({ t: mockT })
const initReactI18next = {
  type: '3rdParty',
  init: jest.fn(),
}

export { useTranslation, initReactI18next }

// const reacti18nextMock = jest.mock('react-i18next', () => ({
//   // this mock makes sure any components using the translate hook can use it without a warning being shown
//   useTranslation: jest.fn().mockReturnValue({ t: mockT }),
//   initReactI18next: {
//     type: '3rdParty',
//     init: jest.fn(),
//   },
// }))

// export default reacti18nextMock
