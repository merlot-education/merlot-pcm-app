import React, { useState, useContext } from 'react'
import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { useNavigation } from '@react-navigation/core'
import { useTranslation } from 'react-i18next'
import Button, { ButtonType } from '../components/button/Button'
import CheckBoxRow from '../components/checkbox/CheckBoxRow'
import InfoTextBox from '../components/text/InfoTextBox'
import { Colors, TextTheme } from '../theme/theme'
import { Context } from '../store/Store'
import { Screens } from '../types/navigators'
import { DispatchAction } from '../store/reducer'

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
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
  const [, dispatch] = useContext(Context)
  const [checked, setChecked] = useState(false)
  const nav = useNavigation()

  const { t } = useTranslation()

  const onSubmitPressed = () => {
    dispatch({
      type: DispatchAction.SetDidAgreeToTerms,
      payload: [{ DidAgreeToTerms: checked }],
    })

    nav.navigate(Screens.Registration, { forgotPin: false })
  }

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
              onPress={nav.goBack}
              buttonType={ButtonType.Ghost}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Terms
