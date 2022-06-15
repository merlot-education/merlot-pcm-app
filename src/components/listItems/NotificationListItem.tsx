import { CredentialExchangeRecord, ProofRecord } from '@aries-framework/core'

import { useNavigation } from '@react-navigation/core'
import { StackNavigationProp } from '@react-navigation/stack'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View, Text, Image } from 'react-native'
import { useConnectionById } from '@aries-framework/react-hooks'
import { ColorPallet, TextTheme } from '../../theme/theme'
import Button, { ButtonType } from '../button/Button'
import { HomeStackParams, Screens } from '../../types/navigators'
import { parsedSchema } from '../../utils/helpers'
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
  const connection = useConnectionById(
    (notification as ProofRecord)?.connectionId || '',
  )

  let onPress: () => void
  let title = ''
  let body = ''

  switch (notificationType) {
    case NotificationType.CredentialOffer: {
      const { name, version } = parsedSchema(
        notification as CredentialExchangeRecord,
      )
      onPress = () =>
        navigation.navigate(Screens.CredentialOffer, {
          credentialId: notification.id,
        })
      title = t('CredentialOffer.CredentialOffer')
      body = `${name} v${version}`
      break
    }
    case NotificationType.ProofRequest: {
      title = t('ProofRequest.ProofRequest')
      body = connection?.theirLabel ?? 'Connectionless proof request'
      onPress = () =>
        navigation.navigate(Screens.ProofRequest, { proofId: notification.id })
      break
    }
    default:
      throw new Error('NotificationType was not set correctly.')
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
          onPress={onPress}
        />
      </View>
    </View>
  )
}

export default NotificationListItem
