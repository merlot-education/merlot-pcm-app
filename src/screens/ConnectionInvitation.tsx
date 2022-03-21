import { t } from 'i18next'
import { View, StyleSheet, Text, Button } from 'react-native'
import React, { useState } from 'react'
import { useAgent } from '@aries-framework/react-hooks'
import { Colors, TextTheme } from '../theme/theme'
import { Screens, Stacks } from '../types/navigators'
import { Loader } from '../components'

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
  navigation: any
  route: any
}

const ConnectionInvitation: React.FC<ConnectionProps> = ({
  navigation,
  route,
}) => {
  const { agent } = useAgent()
  const [loading, setLoading] = useState(false)

  const handleAcceptPress = async (): Promise<void> => {
    const { url } = route.params
    console.log('****Connection URL****')
    console.log(url)
    setLoading(true)
    const connectionRecord = await agent?.connections.receiveInvitationFromUrl(
      url,
      {
        autoAcceptConnection: true,
      },
    )
    if (!connectionRecord?.id) {
      throw new Error(t('Scan.ConnectionNotFound'))
    }
    setLoading(false)
    navigation.getParent()?.navigate(Stacks.TabStack, { screen: Screens.Home })
  }

  return (
    <View style={[styles.container]}>
      <Loader loading={loading} />
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
