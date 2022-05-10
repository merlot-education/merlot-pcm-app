import React, { useCallback, useEffect, useState } from 'react'
import {
  BackHandler,
  Keyboard,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'
import Toast from 'react-native-toast-message'
import { StackScreenProps } from '@react-navigation/stack'
import Clipboard from '@react-native-clipboard/clipboard'
import { useFocusEffect, useNavigation } from '@react-navigation/core'
import { ColorPallet, TextTheme } from '../../theme/theme'
import { TextInput, Loader, Text } from '../../components'
import Button, { ButtonType } from '../../components/button/Button'
import { OnboardingStackParams, Screens } from '../../types/navigators'
import { ToastType } from '../../components/toast/BaseToast'
import { KeychainStorageKeys } from '../../constants'
import {
  getMnemonicArrayFromWords,
  registerUser,
  restoreTermsCompleteStage,
  saveValueInKeychain,
  validateEmail,
} from './Registration.utils'

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

const Registration: React.FC<RegistrationProps> = ({ navigation, route }) => {
  const { forgotPin } = route.params
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [mnemonicText, setMnemonicText] = useState('')
  const nav = useNavigation()
  const { t } = useTranslation()

  const createMnemonic = useCallback(() => {
    const mnemonicWordsList = getMnemonicArrayFromWords(8)
    const mnemonic = mnemonicWordsList.join(' ')
    setMnemonicText(mnemonic)
  }, [])

  useEffect(() => {
    createMnemonic()
  }, [createMnemonic])

  const copyMnemonic = async () => {
    Clipboard.setString(mnemonicText)
    await saveValueInKeychain(
      KeychainStorageKeys.mnemonicText,
      mnemonicText,
      t('Registration.MnemonicMsg'),
    )
  }

  const confirmEntry = async (email: string) => {
    if (email.length > 0) {
      if (validateEmail(email)) {
        await saveValueInKeychain(
          KeychainStorageKeys.Email,
          email,
          t('Registration.UserAuthenticationEmail'),
        )
        if (!forgotPin) {
          await saveValueInKeychain(
            KeychainStorageKeys.Passphrase,
            mnemonicText,
            t('Registration.Passphrase'),
          )
        }
        // try {
        //   setLoading(true)
        //   const {
        //     data: { otpId },
        //     message,
        //   } = await registerUser(email, '')
        //   setLoading(false)
        //   Toast.show({
        //     type: ToastType.Success,
        //     text1: t('Toasts.Success'),
        //     text2: message,
        //   })
        //   if (forgotPin) {
        //     navigation.navigate(Screens.VerifyOtp, {
        //       email,
        //       forgotPin,
        //       otpId,
        //     })
        //   } else {
        //     navigation.navigate(Screens.VerifyOtp, {
        //       email,
        //       forgotPin,
        //       otpId,
        //     })
        //   }
        // } catch (error) {
        //   setLoading(false)
        //   Toast.show({
        //     type: ToastType.Error,
        //     text1: error.name,
        //     text2: error.message,
        //   })
        // }
        navigation.navigate(Screens.CreatePin, { forgotPin })
      } else {
        Toast.show({
          type: ToastType.Warn,
          text1: t('Toasts.Warning'),
          text2: t('Registration.ValidEmail'),
        })
      }
    } else {
      Toast.show({
        type: ToastType.Warn,
        text1: t('Toasts.Warning'),
        text2: t('Registration.EnterEmail'),
      })
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
        {!forgotPin && (
          <>
            <Text style={style.label}>{t('Registration.Mnemonic')}</Text>
            <View style={style.boxContainer}>
              <Text style={style.headerText}>{mnemonicText}</Text>
              <Text style={style.bodyText}>
                {t('Registration.MnemonicMsg')}
              </Text>
              <Button
                title={t('Global.Copy')}
                buttonType={ButtonType.Primary}
                onPress={copyMnemonic}
              />
            </View>
          </>
        )}
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
