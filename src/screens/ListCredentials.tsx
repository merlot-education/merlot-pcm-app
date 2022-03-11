import React from 'react'
import { StyleSheet, View } from 'react-native'
import { Text } from '../components'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})

const ListCredentials: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text>Credentials</Text>
    </View>
  )
}

export default ListCredentials
