import { t } from 'i18next'
import { View, StyleSheet, Text, Button } from 'react-native'
import React, { useState } from 'react'
import { useAgent } from '@aries-framework/react-hooks'
import { useNavigation } from '@react-navigation/core'
import { StackNavigationProp } from '@react-navigation/stack'
import { Colors, TextTheme } from '../theme/theme'
import { ConnectionInvitationStackParams, Screens } from '../types/navigators'
import ContactStack from '../navigators/ContactStack'

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
interface ConnectionProps {
  navigation: StackNavigationProp<
    ConnectionInvitationStackParams,
    'Connection Invitation URL'
  >
  route: any
}

const ConnectionInvitation: React.FC<ConnectionProps> = ({
  navigation,
  route,
}) => {
  const { agent } = useAgent()
  const nav = useNavigation()
  const handleAcceptPress = async (): Promise<void> => {
    const { url } = route.params
    console.log('****Connection URL****')
    console.log(url)
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
        {t('ConnectionInvitation.ConsentMessage')}
      </Text>
      <View style={styles.spacer} />
      <View style={[{ marginHorizontal: 20 }]}>
        <View style={[{ paddingBottom: 10 }]}>
          <Button title={t('Global.Accept')} onPress={handleAcceptPress} />
        </View>
        <Button title={t('Global.Decline')} />
      </View>
    </View>
  )
}
export default ConnectionInvitation
