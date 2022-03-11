import { t } from 'i18next'
import { View, FlatList, StyleSheet, Text, Button } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useAgent, useConnectionById } from '@aries-framework/react-hooks'
import { RouteProp, useNavigation } from '@react-navigation/core'
import { StackNavigationProp } from '@react-navigation/stack'
import { Label } from '../components'
import { ButtonType } from '../components/button/Button'
import { Colors, TextTheme } from '../theme/theme'
import Screens from '../utils/constants'
import { ConnectionInvitationStackParams } from '../types/navigators'

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
  route: RouteProp<ConnectionInvitationStackParams, 'Connection Invitation URL'>
}

const ConnectionInvitation: React.FC<ConnectionProps> = ({
  navigation,
  route,
}) => {
  const { agent } = useAgent()
  const nav = useNavigation()
  const [connectionId, setConnectionId] = useState('')
  const handleAcceptPress = async (): Promise<void> => {
    // TODO: Change to a full screen modal
    // displayPendingMessage()
    const connectionURL = route?.params?.connectionInvitationURL
    console.log('****Connection URL****')
    console.log(connectionURL)
    const connectionRecord = await agent?.connections.receiveInvitationFromUrl(
      connectionURL,
      {
        autoAcceptConnection: true,
      },
    )
    if (!connectionRecord?.id) {
      throw new Error(t('Scan.ConnectionNotFound'))
    }
    setConnectionId(connectionRecord.id)
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
          <Button
            title={t('Global.Accept')}
            // buttonType={ButtonType.Primary}
            onPress={handleAcceptPress}
          />
        </View>
        <Button title={t('Global.Decline')} />
      </View>
    </View>
  )
}
export default ConnectionInvitation
