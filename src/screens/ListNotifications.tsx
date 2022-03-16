import React from 'react'
import { FlatList, View } from 'react-native'
import useNotifications from '../hooks/notifcations'
import { NotificationListItem } from '../components'
import { NotificationType } from '../components/listItems/NotificationListItem'

const ListNotifications: React.FC = () => {
  const { notifications } = useNotifications()

  return (
    <FlatList
      data={notifications}
      renderItem={({ item, index }) => (
        <View
          style={{
            marginHorizontal: 15,
            marginTop: 15,
            marginBottom: index === notifications.length - 1 ? 45 : 0,
          }}
        >
          {item.type === 'CredentialRecord' ? (
            <NotificationListItem
              notificationType={NotificationType.CredentialOffer}
              notification={item}
            />
          ) : (
            <NotificationListItem
              notificationType={NotificationType.ProofRequest}
              notification={item}
            />
          )}
        </View>
      )}
    />
  )
}

export default ListNotifications
