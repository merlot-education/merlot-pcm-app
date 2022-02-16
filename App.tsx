import React from 'react'
import { SafeAreaView, StyleSheet, Text, Button, Alert } from 'react-native'
import Config from "react-native-config";


const App = () => {
  const showAlert = () =>
    Alert.alert('Alert', 'Personal Credential Manager', [
      { text: 'Cancel' },
      { text: 'OK' },
    ])
console.log('Config.API_URL;', Config.API_URL)
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
