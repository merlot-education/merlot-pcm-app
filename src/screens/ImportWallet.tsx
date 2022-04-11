import { ConnectionRecord } from '@aries-framework/core'
import { useConnections } from '@aries-framework/react-hooks'
import { t } from 'i18next'
import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { View, FlatList, StyleSheet, Keyboard } from 'react-native'
import { SearchBar } from 'react-native-screens'
import { ContactListItem } from '../components'
import Button, { ButtonType } from '../components/button/Button'
import { ColorPallet } from '../theme/theme'

const styles = StyleSheet.create({
  container: {
    backgroundColor: ColorPallet.grayscale.white,
    margin: 20,
  },
})
const ImportWallet: React.FC = () => {
  //   const importWallet = () => {}
  return (
    <View style={styles.container}>
      <Button
        title={t('Global.ImportWallet')}
        buttonType={ButtonType.Primary}
        onPress={() => {
          Keyboard.dismiss()
          //   importWallet()
        }}
      />
    </View>
  )
}

export default ImportWallet
