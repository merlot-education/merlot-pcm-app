// const rnLocalizeMock = jest.mock('react-native-localize', () => ({
//   getLocales: () => [
//     {
//       countryCode: 'GB',
//       languageTag: 'en-GB',
//       languageCode: 'en',
//       isRTL: false,
//     },
//     {
//       countryCode: 'US',
//       languageTag: 'en-US',
//       languageCode: 'en',
//       isRTL: false,
//     },
//     {
//       countryCode: 'FR',
//       languageTag: 'fr-FR',
//       languageCode: 'fr',
//       isRTL: false,
//     },
//   ],

//   getNumberFormatSettings: () => ({
//     decimalSeparator: '.',
//     groupingSeparator: ',',
//   }),

//   getCalendar: () => 'gregorian', // or "japanese", "buddhist"
//   getCountry: () => 'US', // the country code you want
//   getCurrencies: () => ['USD', 'EUR'], // can be empty array
//   getTemperatureUnit: () => 'celsius', // or "fahrenheit"
//   getTimeZone: () => 'Europe/Paris', // the timezone you want
//   uses24HourClock: () => true,
//   usesMetricSystem: () => true,

//   addEventListener: jest.fn(),
//   removeEventListener: jest.fn(),
//   findBestAvailableLanguage: () => ({
//     languageTag: 'en-US',
//     isRTL: false,
//   }),
// }))

// export default rnLocalizeMock
// // export const findBestAvailableLanguage = jest.fn(() => ({
// //   languageTag: 'en',
// //   isRTL: false,
// // }))
// import RNLocalize from 'react-native-localize/mock'

// const rnLocalizeMock = jest.mock('react-native-localize', () => RNLocalize)

// export default rnLocalizeMock

const findBestAvailableLanguage = () => ({
  languageTag: 'en-US',
  isRTL: false,
});

export default { findBestAvailableLanguage };
