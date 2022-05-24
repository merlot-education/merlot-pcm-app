import React, { useCallback, useState } from 'react'
import { BackHandler, Keyboard, ScrollView, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'
import { StackScreenProps } from '@react-navigation/stack'
import { useFocusEffect, useNavigation } from '@react-navigation/core'
import { ColorPallet, TextTheme } from '../../theme/theme'
import { TextInput, Loader } from '../../components'
import Button, { ButtonType } from '../../components/button/Button'
import { OnboardingStackParams, Screens } from '../../types/navigators'
import { KeychainStorageKeys } from '../../constants'
import {
  registerUser,
  restoreTermsCompleteStage,
  saveValueInKeychain,
  validateEmail,
} from './Registration.utils'
import { warningToast, errorToast, successToast } from '../../utils/toast'

type RegistrationProps = StackScreenProps<
  OnboardingStackParams,
  Screens.Registration
>

const style = StyleSheet.create({
  container: {
    backgroundColor: ColorPallet.grayscale.white,
    flex: 1,
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
          successToast(message)
          navigation.navigate(Screens.VerifyOtp, { email, otpId })
        } catch (error) {
          setLoading(false)
          errorToast(error.message)
        }
      } else {
        warningToast(t('Registration.ValidEmail'))
      }
    } else {
      warningToast(t('Registration.EnterEmail'))
    }
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
    <SafeAreaView style={style.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={style.subContainer}
      >
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
        />
        <Button
          title={t('Global.Submit')}
          buttonType={ButtonType.Primary}
          onPress={() => {
            Keyboard.dismiss()
            confirmEntry(email)
          }}
        />
      </ScrollView>
    </SafeAreaView>
  )
}

export default Registration
