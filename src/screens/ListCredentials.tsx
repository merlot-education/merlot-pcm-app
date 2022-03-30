import { CredentialState, CredentialRecord } from '@aries-framework/core'
import { useCredentialByState } from '@aries-framework/react-hooks'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { FlatList, View } from 'react-native'
import { Text } from '../components'
import { ColorPallet } from '../theme/theme'
import CredentialListItem from '../components/listItems/CredentialListItem'

const ListCredentials: React.FC = () => {
  const credentials = [
    ...useCredentialByState(CredentialState.CredentialReceived),
    ...useCredentialByState(CredentialState.Done),
  ]
  const { t } = useTranslation()

  const emptyListComponent = () => (
    <Text style={{ textAlign: 'center', marginTop: 100 }}>
      {t('Global.NoneYet!')}
    </Text>
  )

  return (
    <FlatList
      style={{ backgroundColor: ColorPallet.grayscale.white }}
      data={credentials.sort(
        (a, b) =>
          new Date(b.createdAt).valueOf() - new Date(a.createdAt).valueOf(),
      )}
      keyExtractor={(item: CredentialRecord) => item.credentialId || item.id}
      ListEmptyComponent={emptyListComponent}
      renderItem={({ item, index }) => (
        <View
          style={{
            marginHorizontal: 15,
            marginTop: 15,
            marginBottom: index === credentials.length - 1 ? 45 : 0,
          }}
        >
          <CredentialListItem credential={item} />
        </View>
      )}
    />
  )
}

export default ListCredentials
