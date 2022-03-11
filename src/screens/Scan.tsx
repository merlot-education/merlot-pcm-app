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

const Scan: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text>Scan</Text>
    </View>
  )
}

export default Scan
