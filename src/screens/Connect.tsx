import React from 'react'
import { Alert, StyleSheet, Text, View } from 'react-native'
import { useTranslation } from 'react-i18next'
import { useAgent } from '@aries-framework/react-hooks'
import { useNavigation } from '@react-navigation/core'
import { Colors, TextTheme } from '../theme/theme'
import Button, { ButtonType } from '../components/button/Button'
import Screens from '../utils/constants'
import * as api from '../api'

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    margin: 20,
  },
  bodyText: {
    ...TextTheme.normal,
    flexShrink: 1,
  },
  spacer: {
    height: 40,
    width: 50,
  },
})

const Connect: React.FC = () => {
  const { agent } = useAgent()
  const { t } = useTranslation()
  const nav = useNavigation()

  const getConnectionInvitationUrl = async () => {
    const connectionInvitationUrlResponse =
      await api.default.config.connectionInvitation({
        autoAcceptConnection: false,
      })
  }
  const connectWithOrganization = async () => {
    // Add invitation here for now
    const url = ''
    const connectionRecord = await agent?.connections.receiveInvitationFromUrl(
      url,
      {
        autoAcceptConnection: true,
      },
    )
    if (!connectionRecord?.id) {
      // throw new Error(t('Scan.ConnectionNotFound'))
    }
    nav.navigate(Screens.ListContacts)
  }
  const showAlert = async () => {
    Alert.alert(t(''))
  }

  return (
    <View style={[styles.container]}>
      <Text style={[styles.bodyText, { fontWeight: 'bold' }]}>
        Do you want to connect with AISBL ?
      </Text>

      <View style={styles.spacer} />
      <Button
        title={t('Yes')}
        buttonType={ButtonType.Primary}
        onPress={connectWithOrganization}
      />
      <View style={styles.spacer} />
      <Button
        title={t('No')}
        buttonType={ButtonType.Primary}
        onPress={showAlert}
      />
    </View>
  )
}

export default Connect
