import React from 'react'
import { StyleSheet, View } from 'react-native'
import { ColorPallet, Colors } from '../../theme/theme'

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
  },
})

const RecordHeader: React.FC = ({ children }) => {
  return <View style={styles.container}>{children}</View>
}

export default RecordHeader
