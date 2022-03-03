import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { useTranslation } from 'react-i18next'
import { useNavigation } from '@react-navigation/core'
import { Colors, TextTheme } from '../theme/theme'
import Button, { ButtonType } from '../components/button/Button'
import Screens from '../utils/constants'

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    margin: 20,
  },
  bodyText: {
    ...TextTheme.normal,
    flexShrink: 1,
  },
  spacer: {
    height: 40,
  },
})

const Consent: React.FC = () => {
  const { t } = useTranslation()
  const nav = useNavigation()

  const nextPage = () => {
    nav.navigate(Screens.ListContacts)
  }

  return (
    <View style={[styles.container]}>
      <Text style={[styles.bodyText, { fontWeight: 'bold' }]}>
        Do you want to show connections
      </Text>
      <View style={styles.spacer} />
      <Button
        title={t('Global.Yes')}
        buttonType={ButtonType.Primary}
        onPress={nextPage}
      />
      <Button title={t('Global.No')} buttonType={ButtonType.Primary} />
    </View>
  )
}

export default Consent
