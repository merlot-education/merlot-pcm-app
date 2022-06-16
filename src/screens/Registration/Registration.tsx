import React, { useCallback, useState } from 'react'
import { BackHandler, StyleSheet, View, Image, Keyboard } from 'react-native'
import { useTranslation } from 'react-i18next'
import { StackScreenProps } from '@react-navigation/stack'
import { useFocusEffect, useNavigation } from '@react-navigation/core'
import { ColorPallet, TextTheme } from '../../theme/theme'
import {
  TextInput,
  Loader,
  InfoCard,
  ScreenNavigatorButtons,
} from '../../components'
import { OnboardingStackParams, Screens } from '../../types/navigators'
import { KeychainStorageKeys } from '../../constants'
import {
  registerUser,
  restoreTermsCompleteStage,
  saveValueInKeychain,
  validateEmail,
} from './Registration.utils'
import Images from '../../assets'

type RegistrationProps = StackScreenProps<
  OnboardingStackParams,
  Screens.Registration
>

const style = StyleSheet.create({
  container: {
    backgroundColor: ColorPallet.grayscale.white,
    flex: 1,
    justifyContent: 'space-between',
    margin: 20,
  },

  subContainer: {
    backgroundColor: ColorPallet.grayscale.white,
    flex: 1,
    margin: 20,
  },
  bodyText: {
    ...TextTheme.caption,
    flexShrink: 1,
    fontWeight: 'bold',
    marginVertical: 20,
  },
  boxContainer: {
    backgroundColor: ColorPallet.notification.info,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: ColorPallet.notification.infoBorder,
    padding: 10,
    marginTop: 10,
    marginBottom: 20,
  },
  emailImg: {
    height: 120,
    width: 60,
    alignSelf: 'center',
  },
  label: {
    ...TextTheme.normal,
    fontWeight: 'bold',
  },
  headerText: {
    ...TextTheme.normal,
    color: ColorPallet.notification.infoText,
    flexShrink: 1,
  },
})

const Registration: React.FC<RegistrationProps> = ({ navigation }) => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const nav = useNavigation()
  const { t } = useTranslation()

  const confirmEntry = async (email: string) => {
    if (email.length > 0) {
      if (validateEmail(email)) {
        await saveValueInKeychain(
          KeychainStorageKeys.Email,
          email,
          t('Registration.UserAuthenticationEmail'),
        )
        try {
          setLoading(true)
          const {
            data: { otpId },
            message,
          } = await registerUser(email, '')
          setLoading(false)
          // successToast(message)
          setError(message)
          navigation.navigate(Screens.VerifyOtp, { email, otpId })
        } catch (error) {
          setLoading(false)
          // errorToast(error.message)
          setError(error.message)
        }
      } else {
        setError(t('Registration.ValidEmail'))
      }
    } else {
      setError(t('Registration.EnterEmail'))
    }
  }

  const onBack = async () => {
    nav.navigate(Screens.Terms)
  }

  useFocusEffect(
    useCallback(() => {
      const onBackPress = async () => {
        await restoreTermsCompleteStage()
        nav.navigate(Screens.Terms)
        return true
      }

      BackHandler.addEventListener('hardwareBackPress', onBackPress)

      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress)
    }, [nav]),
  )

  return (
    <View style={style.container}>
      <Loader loading={loading} />
      <TextInput
        label={t('Global.Email')}
        placeholder={t('Global.Email')}
        placeholderTextColor={ColorPallet.brand.primary}
        accessible
        accessibilityLabel={t('Global.Email')}
        autoFocus
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        returnKeyType="done"
      />
      <Image source={Images.emailIcon} style={style.emailImg} />
      <InfoCard showBottomIcon={false} showTopIcon errorMsg={error}>
        {t('Registration.EmailInfo')}
      </InfoCard>
      <ScreenNavigatorButtons
        onLeftPress={onBack}
        onRightPress={() => {
          Keyboard.dismiss()
          confirmEntry(email)
        }}
      />
    </View>
  )
}

export default Registration
