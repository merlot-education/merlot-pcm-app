import React from 'react'
import { ScrollView, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { ColorPallet } from '../../theme/theme'

interface Props {
  children: React.ReactNode
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ColorPallet.grayscale.white,
  },
  scrollView: {
    alignItems: 'center',
  },
})

const SafeAreaScrollView: React.FC<Props> = ({ children }) => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        {children}
      </ScrollView>
    </SafeAreaView>
  )
}

export default SafeAreaScrollView
