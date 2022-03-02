import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { useTranslation } from 'react-i18next'
import { useAgent } from '@aries-framework/react-hooks'
import { useNavigation } from '@react-navigation/core'
import { Colors, TextTheme } from '../theme/theme'
import Button, { ButtonType } from '../components/button/Button'
import Screens from '../utils/constants'

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
  },
})

const Connect: React.FC = () => {
  const { agent } = useAgent()
  const { t } = useTranslation()
  const nav = useNavigation()

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
      throw new Error(t('Scan.ConnectionNotFound'))
    }
    nav.navigate(Screens.ListContacts)
  }

  return (
    <View style={[styles.container]}>
      <Text style={[styles.bodyText, { fontWeight: 'bold' }]}>
        Accept connection to connect
      </Text>

      <View style={styles.spacer} />
      <Button
        title={t('Global.Continue')}
        buttonType={ButtonType.Primary}
        onPress={connectWithOrganization}
      />
    </View>
  )
}

export default Connect
