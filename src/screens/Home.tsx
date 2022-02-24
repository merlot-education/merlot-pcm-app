import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
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
  return (
    <View style={[styles.container]}>
      <Text style={[styles.bodyText, { fontWeight: 'bold' }]}>
        You are login successfully
      </Text>
    </View>
  )
}

export default Home
