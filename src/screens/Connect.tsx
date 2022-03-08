import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
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
        autoAcceptConnection: true,
      })
    if (connectionInvitationUrlResponse.data != null) {
      const url = connectionInvitationUrlResponse.data.invitationUrl
      await connectWithOrganization(url)
    }
  }
  const connectWithOrganization = async (url: string) => {
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

  return (
    <View style={[styles.container]}>
      <Text style={[styles.bodyText, { fontWeight: 'bold' }]}>
        Do you want to connect with AISBL ?
      </Text>

      <View style={styles.spacer} />
      <Button
        title={t('Yes')}
        buttonType={ButtonType.Primary}
        onPress={getConnectionInvitationUrl}
      />
      <View style={styles.spacer} />
      <Button title={t('No')} buttonType={ButtonType.Primary} />
    </View>
  )
}

export default Connect
