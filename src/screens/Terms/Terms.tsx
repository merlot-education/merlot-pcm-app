import React, { useCallback, useState } from 'react'
import { BackHandler, SafeAreaView, StyleSheet, Text, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { useFocusEffect, useNavigation } from '@react-navigation/core'
import { useTranslation } from 'react-i18next'
import Button, { ButtonType } from '../../components/button/Button'
import CheckBoxRow from '../../components/checkbox/CheckBoxRow'
import InfoTextBox from '../../components/text/InfoTextBox'
import { ColorPallet, TextTheme } from '../../theme/theme'
import { Screens } from '../../types/navigators'
import {
  storeTermsCompleteStage,
  restoreAppIntroCompleteStage,
} from './Terms.utils'

const styles = StyleSheet.create({
  container: {
    backgroundColor: ColorPallet.grayscale.white,
    margin: 20,
  },
  bodyText: {
    ...TextTheme.normal,
    flexShrink: 1,
  },
  controlsWrapper: {
    marginTop: 15,
  },
  verticalSpacer: {
    marginVertical: 20,
  },
  topSpacer: {
    paddingTop: 10,
  },
})

const Terms: React.FC = () => {
  const [checked, setChecked] = useState(false)
  const nav = useNavigation()
  let backCount = 0

  const { t } = useTranslation()

  const onSubmitPressed = async () => {
    await storeTermsCompleteStage()
    nav.navigate(Screens.Registration, { forgotPin: false })
  }

  const onBack = async () => {
    await restoreAppIntroCompleteStage()
    nav.navigate(Screens.Onboarding)
  }
  useFocusEffect(
    useCallback(() => {
      const onBackPress = async () => {
        // BackHandler.exitApp()
        // eslint-disable-next-line no-plusplus
        backCount++
        if (backCount === 1) {
          await restoreAppIntroCompleteStage()
          nav.navigate(Screens.Onboarding)
        } else {
          BackHandler.exitApp()
        }

        return true
      }

      BackHandler.addEventListener('hardwareBackPress', onBackPress)

      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress)
    }, [backCount, nav]),
  )
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <InfoTextBox>{t('Terms.AcceptTerms')}</InfoTextBox>
        <Text style={[styles.bodyText, styles.verticalSpacer]}>
          {t('Terms.TermsAndConditions')}
        </Text>
        <View style={styles.controlsWrapper}>
          <CheckBoxRow
            title={t('Terms.Attestation')}
            accessibilityLabel="I Agree"
            checked={checked}
            onPress={() => setChecked(!checked)}
          />
          <View style={styles.topSpacer}>
            <Button
              title={t('Global.Continue')}
              onPress={onSubmitPressed}
              disabled={!checked}
              buttonType={ButtonType.Primary}
            />
          </View>
          <View style={styles.topSpacer}>
            <Button
              title={t('Global.Back')}
              onPress={onBack}
              buttonType={ButtonType.Ghost}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Terms
