import React from 'react'
import { StyleSheet, View } from 'react-native'
import { ColorPallet, Colors } from '../../theme/theme'

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    height: '100%',
    paddingHorizontal: 25,
    paddingVertical: 16,
  },
})

const RecordFooter: React.FC = ({ children }) => {
  return <View style={styles.container}>{children}</View>
}

export default RecordFooter
