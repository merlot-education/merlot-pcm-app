import React, { useEffect } from 'react'
import { SafeAreaView, StyleSheet, Text, Button, Alert } from 'react-native'
import SplashScreen from 'react-native-splash-screen'

const App = () => {
  useEffect(() => {
    // Hide the native splash / loading screen so that our
    // RN version can be displayed.
    SplashScreen.hide()
  }, [])

  const showAlert = () =>
    Alert.alert('Alert', 'Personal Credential Manager', [
      { text: 'Cancel' },
      { text: 'OK' },
    ])

  return (
    <SafeAreaView style={styles.container}>
      <Text>Personal Credential Manager</Text>
      <Button title="Show Alert" onPress={showAlert} />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
})

export default App
