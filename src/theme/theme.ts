import { Theme } from '@ant-design/react-native/lib/style'

type BaseColor = Record<string, string>

interface FontAttributes {
  fontSize: number
  fontWeight:
    | 'normal'
    | 'bold'
    | '100'
    | '200'
    | '300'
    | '400'
    | '500'
    | '600'
    | '700'
    | '800'
    | '900'
  color: string
}

interface BrandColors {
  primary: string
  highlight: string
  primaryBackground: string
  secondaryBackground: string
  link: string
}

interface SemanticColors {
  error: string
  success: string
  focus: string
}

interface NotificationColors {
  success: string
  successBorder: string
  successIcon: string
  successText: string
  info: string
  infoBorder: string
  infoIcon: string
  infoText: string
  warn: string
  warnBorder: string
  warnIcon: string
  warnText: string
  error: string
  errorBorder: string
  errorIcon: string
  errorText: string
}

interface GrayscaleColors {
  black: string
  darkGrey: string
  mediumGrey: string
  lightGrey: string
  veryLightGrey: string
  white: string
}

interface ColorPallet {
  brand: BrandColors
  semantic: SemanticColors
  notification: NotificationColors
  grayscale: GrayscaleColors
}

export const borderRadius = 4
export const heavyOpacity = 0.7
export const lightOpacity = 0.35
export const zeroOpacity = 0.0
export const borderWidth = 2

const BrandColors: BrandColors = {
  primary: '#03028A',
  highlight: '#FCBA19',
  primaryBackground: '#000000',
  secondaryBackground: '#313132',
  link: '#FFFFFF',
}

const SemanticColors: SemanticColors = {
  error: '#D8292F',
  success: '#2E8540',
  focus: '#3399ff',
}

const NotificationColors: NotificationColors = {
  success: '#313132',
  successBorder: '#2E8540',
  successIcon: '#2E8540',
  successText: '#FFFFFF',
  info: '#313132',
  infoBorder: '#0099FF',
  infoIcon: '#0099FF',
  infoText: '#FFFFFF',
  warn: '#313132',
  warnBorder: '#fcba19',
  warnIcon: '#fcba19',
  warnText: '#FFFFFF',
  error: '#313132',
  errorBorder: '#D8292F',
  errorIcon: '#D8292F',
  errorText: '#FFFFFF',
}

const GrayscaleColors: GrayscaleColors = {
  black: '#000000',
  darkGrey: '#313132',
  mediumGrey: '#606060',
  lightGrey: '#d3d3d3',
  veryLightGrey: '#f2f2f2',
  white: '#FFFFFF',
}

export const ColorPallet: ColorPallet = {
  brand: BrandColors,
  semantic: SemanticColors,
  notification: NotificationColors,
  grayscale: GrayscaleColors,
}

export const BaseColors: BaseColor = {
  black: '#000000',
  darkGreen: '#35823F',
  darkGreenLightTransparent: `rgba(53, 130, 63, ${heavyOpacity})`,
  darkGreenHeavyTransparent: `rgba(53, 130, 63, ${lightOpacity})`,
  darkGrey: '#1C1C1E',
  green: '#2D6E35',
  lightGrey: '#D3D3D3',
  red: '#DE3333',
  transparent: `rgba(0, 0, 0, ${zeroOpacity})`,
  yellow: '#FCBA19',
  white: '#FFFFFF',
}

export const StatusColors: BaseColor = {
  error: BaseColors.red,
  info: BaseColors.black,
  success: BaseColors.green,
  warning: BaseColors.black,
}

interface ColorTheme extends BaseColor {
  accent: string
  background: string
  backgroundLight: string
  borderLight: string
  primary: string
  primaryActive: string
  shadow: string
  text: string
}

interface FontAttributes {
  fontSize: number
  fontWeight:
    | 'normal'
    | 'bold'
    | '100'
    | '200'
    | '300'
    | '400'
    | '500'
    | '600'
    | '700'
    | '800'
    | '900'
  color: string
}

interface TextTheme {
  headingOne: FontAttributes
  headingTwo: FontAttributes
  headingThree: FontAttributes
  headingFour: FontAttributes
  normal: FontAttributes
  label: FontAttributes
  caption: FontAttributes
}

interface TextBoxTheme {
  background: string
  border: string
  text: string
}

export const Colors: ColorTheme = {
  accent: BaseColors.yellow,
  // background: BaseColors.black,
  background: '#FFF',
  backgroundLight: BaseColors.lightGreen,
  borderLight: BaseColors.mediumGreen,
  primary: BrandColors.primary,
  primaryActive: BaseColors.darkGreenHeavyTransparent,
  shadow: BaseColors.lightGrey,
  text: BrandColors.primary,
  ...BaseColors,
  ...StatusColors,
}

export const TextBoxTheme: TextBoxTheme = {
  background: Colors.darkGreenLightTransparent,
  border: Colors.borderLight,
  text: Colors.text,
}

export const TextTheme: TextTheme = {
  headingOne: {
    fontSize: 38,
    fontWeight: 'bold',
    color: Colors.text,
  },
  headingTwo: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.text,
  },
  headingThree: {
    fontSize: 26,
    fontWeight: 'bold',
    color: Colors.text,
  },
  headingFour: {
    fontSize: 21,
    fontWeight: 'bold',
    color: Colors.text,
  },
  normal: {
    fontSize: 18,
    fontWeight: 'normal',
    color: Colors.text,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.text,
  },
  caption: {
    fontSize: 14,
    fontWeight: 'normal',
    color: Colors.text,
  },
}

export const customTheme: Partial<Theme> = {
  brand_primary: BrandColors.primary,
  brand_primary_tap: BrandColors.primary,

  // button
  primary_button_fill: BrandColors.primary,
  primary_button_fill_tap: BrandColors.primary,

  ghost_button_color: BrandColors.primary,
  ghost_button_fill_tap: BrandColors.primary,

  // input_font_size
  border_color_base: BaseColors.black,
}

interface ContactTheme {
  background: string
}

export const ContactTheme: ContactTheme = {
  background: Colors.shadow,
}
