import { t } from 'i18next'
import { View, StyleSheet, Text } from 'react-native'
import React, { useState } from 'react'
import { useAgent } from '@aries-framework/react-hooks'
import { ColorPallet, TextTheme } from '../theme/theme'
import { TabStacks } from '../types/navigators'
import { Loader } from '../components'
import Button, { ButtonType } from '../components/button/Button'
import ConnectionPending from '../assets/img/connection-pending.svg'

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
  topSpacer: {
    paddingTop: 10,
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
    navigation.navigate(TabStacks.ConnectionStack)
  }

  const handleDeclinePress = () => {
    navigation.navigate(TabStacks.HomeStack)
  }

  return (
    <View style={[styles.container]}>
      <Loader loading={loading} />
      <Text style={[styles.bodyText, { fontWeight: 'bold' }]}>
        {t('ConnectionInvitation.ConsentMessage')}
      </Text>
      <ConnectionPending style={{ marginVertical: 20, alignSelf: 'center' }} />
      <View style={styles.spacer} />
      <View style={styles.topSpacer}>
        <Button
          title={t('Global.Accept')}
          onPress={handleAcceptPress}
          buttonType={ButtonType.Primary}
        />
      </View>
      <View style={styles.topSpacer}>
        <Button
          title={t('Global.Decline')}
          buttonType={ButtonType.Ghost}
          onPress={handleDeclinePress}
        />
      </View>
    </View>
  )
}
export default ConnectionInvitation
