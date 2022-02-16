import React from 'react'
import { View, StyleSheet, Text, Button, Alert } from 'react-native'

const Terms = () => {
  const showAlert = () =>
    Alert.alert('Alert', 'Personal Credential Manager', [
      { text: 'Cancel' },
      { text: 'OK' },
    ])

  return (
    <View style={styles.container}>
      <Text>Personal Credential Manager</Text>
      <Button title="Show Alert" onPress={showAlert} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
})

export default Terms
