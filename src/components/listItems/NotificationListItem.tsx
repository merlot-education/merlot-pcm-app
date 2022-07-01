import { CredentialExchangeRecord, ProofRecord } from '@aries-framework/core'

import { useNavigation } from '@react-navigation/core'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View, Text, Image } from 'react-native'
import { useAgent, useConnectionById } from '@aries-framework/react-hooks'
import { ColorPallet, TextTheme } from '../../theme/theme'
import Button, { ButtonType } from '../button/Button'
import { HomeStackParams, Screens } from '../../types/navigators'
import { parseCredDef } from '../../utils/helpers'
import Images from '../../assets'

const iconSize = 30

export enum NotificationType {
  CredentialOffer = 'Offer',
  ProofRequest = 'Proof',
}

interface NotificationListItemProps {
  notificationType: NotificationType
  notification: CredentialExchangeRecord | ProofRecord
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: ColorPallet.grayscale.veryLightGrey,
    borderRadius: 5,
    padding: 10,
  },
  headerContainer: {
    flexDirection: 'row',
    paddingHorizontal: 5,
    paddingTop: 5,
  },
  bodyContainer: {
    flexGrow: 1,
    flexDirection: 'column',
    marginLeft: 10 + iconSize,
    paddingHorizontal: 5,
    paddingBottom: 5,
  },
  headerText: {
    ...TextTheme.normal,
    flexShrink: 1,
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  bodyText: {
    ...TextTheme.normal,
    flexShrink: 1,
    marginVertical: 15,
    paddingBottom: 10,
  },
  icon: {
    marginRight: 10,
    alignSelf: 'center',
  },
})

const NotificationListItem: React.FC<NotificationListItemProps> = ({
  notificationType,
  notification,
}) => {
  const navigation = useNavigation<StackNavigationProp<HomeStackParams>>()
  const { t } = useTranslation()
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const { agent } = useAgent()
  const connection = useConnectionById(notification?.connectionId || '')

  const getNotificationData = useCallback(async () => {
    if (notificationType === NotificationType.CredentialOffer) {
      setTitle(t('CredentialOffer.CredentialOffer'))
      const credentialRecord = await agent?.credentials.getFormatData(
        notification.id,
      )
      const credentialDefinitionId = credentialRecord?.offer?.indy?.cred_def_id

      const { credName } = parseCredDef(credentialDefinitionId)
      setBody(credName)
    } else {
      setTitle(t('ProofRequest.ProofRequest'))
      setBody(connection?.theirLabel ?? 'Connectionless proof request')
    }
  }, [
    agent?.credentials,
    connection?.theirLabel,
    notification.id,
    notificationType,
    t,
  ])

  useEffect(() => {
    getNotificationData()
  }, [getNotificationData])

  const navigateToNotification = () => {
    if (notificationType === NotificationType.CredentialOffer) {
      navigation.navigate(Screens.CredentialOffer, {
        credentialId: notification.id,
      })
    } else {
      navigation.navigate(Screens.ProofRequest, { proofId: notification.id })
    }
  }

  return (
    <View testID="notification-list-item" style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.icon}>
          <Image
            source={Images.infoIcon}
            style={{ width: iconSize, height: iconSize }}
          />
        </View>
        <Text style={styles.headerText}>{title}</Text>
      </View>
      <View style={styles.bodyContainer}>
        <Text style={styles.bodyText}>{body}</Text>
        <Button
          buttonType={ButtonType.Primary}
          title={t('Global.View')}
          onPress={navigateToNotification}
        />
      </View>
    </View>
  )
}

export default NotificationListItem
