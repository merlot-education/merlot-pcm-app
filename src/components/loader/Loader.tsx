import React from 'react'
import { Modal, View, ActivityIndicator, StyleSheet } from 'react-native'
import { Colors } from '../../theme/theme'

interface LoaderProps {
  loading?: boolean
}

const styles = StyleSheet.create({
  activityIndicatorWrapper: {
    backgroundColor: 'rgba(52, 52, 52, 0.8)',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
})

const Loader: React.FC<LoaderProps> = ({ loading }) => {
  return (
    <Modal animationType="none" visible={loading} transparent>
      <View style={styles.activityIndicatorWrapper}>
        <ActivityIndicator size="small" color={Colors.primary} />
      </View>
    </Modal>
  )
}

export default Loader
