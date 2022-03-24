import React, { useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { useTranslation } from 'react-i18next'
import { useAgent } from '@aries-framework/react-hooks'
import Toast from 'react-native-toast-message'
import { StackScreenProps } from '@react-navigation/stack'
import { Colors, TextTheme } from '../theme/theme'
import Button, { ButtonType } from '../components/button/Button'
import * as api from '../api'
import { Loader } from '../components'
import { ToastType } from '../components/toast/BaseToast'
import { OnboardingStackParams, Screens } from '../types/navigators'

type DefaultConnectionProps = StackScreenProps<
  OnboardingStackParams,
  Screens.DefaultConnection
>

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

const DefaultConnection: React.FC<DefaultConnectionProps> = ({ route }) => {
  const { setAuthenticated } = route.params
  const [loading, setLoading] = useState(false)
  const { agent } = useAgent()
  const { t } = useTranslation()

  const getConnectionInvitationUrl = async () => {
    setLoading(true)
    const connectionInvitationUrlResponse =
      await api.default.config.invitationUrl()
    if (connectionInvitationUrlResponse.data != null) {
      const url = connectionInvitationUrlResponse.data.invitationUrl
      await connectWithOrganization(url)
    }
    setAuthenticated(true)
  }
  const connectWithOrganization = async (url: string) => {
    const connectionRecord = await agent?.connections.receiveInvitationFromUrl(
      url,
      {
        autoAcceptConnection: true,
      },
    )
    setLoading(false)
    if (!connectionRecord?.id) {
      Toast.show({
        type: ToastType.Error,
        text1: t('Toasts.Error'),
        text2: t('DefaultConnection.ConnectionNotFound'),
      })
      throw new Error(t('DefaultConnection.ConnectionNotFound'))
    }
  }

  return (
    <View style={[styles.container]}>
      <Loader loading={loading} />
      <Text style={[styles.bodyText, { fontWeight: 'bold' }]}>
        {t('DefaultConnection.ConnectWith')}
      </Text>

      <View style={styles.spacer} />
      <Button
        title={t('Settings.Yes')}
        buttonType={ButtonType.Primary}
        onPress={getConnectionInvitationUrl}
      />
      <View style={styles.spacer} />
      <Button title={t('Settings.No')} buttonType={ButtonType.Primary} />
    </View>
  )
}

export default DefaultConnection
