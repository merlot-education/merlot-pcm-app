import React from 'react'
import { StyleSheet, View } from 'react-native'
import { ColorPallet } from '../../theme/theme'

const styles = StyleSheet.create({
  container: {
    backgroundColor: ColorPallet.grayscale.white,
    height: '100%',
    paddingHorizontal: 25,
    paddingVertical: 16,
  },
})

const RecordFooter: React.FC = ({ children }) => {
  return (
    <View style={styles.container} testID="recordFooter">
      {children}
    </View>
  )
}

export default RecordFooter
