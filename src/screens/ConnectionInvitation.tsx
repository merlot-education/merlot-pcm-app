import { t } from 'i18next'
import { View, StyleSheet, Text, Button } from 'react-native'
import React, { useState } from 'react'
import { useAgent } from '@aries-framework/react-hooks'
import { ColorPallet, TextTheme } from '../theme/theme'
import { TabStacks } from '../types/navigators'
import { Loader } from '../components'

const styles = StyleSheet.create({
  container: {
    backgroundColor: ColorPallet.grayscale.white,
    margin: 20,
  },
  bodyText: {
    ...TextTheme.normal,
    flexShrink: 1,
    alignSelf: 'center',
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
    navigation.navigate(TabStacks.ContactStack)
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
