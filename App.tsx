import React from 'react'
import { SafeAreaView, StyleSheet, Text, Button, Alert } from 'react-native'

function App() {
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
