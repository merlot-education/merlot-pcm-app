import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { useTranslation } from 'react-i18next'
import { useNavigation } from '@react-navigation/core'
import { Colors, TextTheme } from '../theme/theme'

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    margin: 20,
  },
  bodyText: {
    ...TextTheme.normal,
    flexShrink: 1,
  },
})

const Home: React.FC = () => {
  const { t } = useTranslation()
  const navigation = useNavigation()

  const nextPage = () => {
    navigation.navigate(Screens.ConnectionInvitation)
  }

  return (
    <View style={[styles.container]}>
      <Text style={[styles.bodyText, { fontWeight: 'bold' }]}>Home</Text>
    </View>
  )
}

export default Home
