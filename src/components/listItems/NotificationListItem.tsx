import type { CredentialRecord, ProofRecord } from '@aries-framework/core'

import { useNavigation } from '@react-navigation/core'
import { StackNavigationProp } from '@react-navigation/stack'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View, Text } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { ColorPallet, TextTheme } from '../../theme/theme'
import Button, { ButtonType } from '../button/Button'
import { HomeStackParams, Screens } from '../../types/navigators'
import { parsedSchema } from '../../utils/helpers'

const iconSize = 30

export enum NotificationType {
  CredentialOffer = 'Offer',
  ProofRequest = 'Proof',
}

interface NotificationListItemProps {
  notificationType: NotificationType
  notification: CredentialRecord | ProofRecord
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: ColorPallet.notification.info,
    borderColor: ColorPallet.notification.infoBorder,
    borderRadius: 5,
    borderWidth: 1,
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
    color: ColorPallet.notification.infoText,
  },
  bodyText: {
    ...TextTheme.normal,
    flexShrink: 1,
    marginVertical: 15,
    paddingBottom: 10,
    color: ColorPallet.notification.infoText,
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

  let onPress: () => void
  let title = ''
  let body = ''

  switch (notificationType) {
    case NotificationType.CredentialOffer: {
      const { name, version } = parsedSchema(notification as CredentialRecord)
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
      body =
        (notification as ProofRecord).requestMessage?.indyProofRequest?.name ||
        ''
      onPress = () =>
        navigation.navigate(Screens.ProofRequest, { proofId: notification.id })
      break
    }
    default:
      throw new Error('NotificationType was not set correctly.')
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={[styles.icon]}>
          <Icon
            name="info"
            size={iconSize}
            color={ColorPallet.notification.infoIcon}
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
