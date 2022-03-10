import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { useTranslation } from 'react-i18next'
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

interface HomeProps {
  navigation: any
}

const Home: React.FC<HomeProps> = ({ navigation }) => {
  const { t } = useTranslation()

  const nextPage = () => {
    navigation.navigate(Screens.Scan)
  }

  return (
    <View style={[styles.container]}>
      <Text style={[styles.bodyText, { fontWeight: 'bold' }]}>
        {/* {t('Home.LoginMsg')} */}
        Your wallet is created successfully.
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

export default Home
