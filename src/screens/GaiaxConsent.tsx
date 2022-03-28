import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { useTranslation } from 'react-i18next'
import { ColorPallet, TextTheme } from '../theme/theme'
import Button, { ButtonType } from '../components/button/Button'
import { Screens } from '../types/navigators'

const styles = StyleSheet.create({
  container: {
    backgroundColor: ColorPallet.grayscale.white,
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

interface HomeProps {
  navigation: any
}

const GaiaxConsent: React.FC<HomeProps> = ({ navigation }) => {
  const { t } = useTranslation()

  const nextPage = () => {
    navigation.navigate(Screens.DefaultConnection)
  }

  return (
    <View style={[styles.container]}>
      <Text style={[styles.bodyText, { fontWeight: 'bold' }]}>
        {t('GaiaxConsent.WalletCreated')}
      </Text>
      <View style={styles.spacer} />
      <Button
        title={t('Global.Continue')}
        buttonType={ButtonType.Primary}
        onPress={nextPage}
      />
    </View>
  )
}

export default GaiaxConsent
