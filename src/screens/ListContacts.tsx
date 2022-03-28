import type { ConnectionRecord } from '@aries-framework/core'
import { useConnections } from '@aries-framework/react-hooks'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FlatList, StyleSheet, View } from 'react-native'
import { SearchBar } from 'react-native-elements'
import { ContactListItem, Text } from '../components'
import { ColorPallet, TextTheme } from '../theme/theme'

const styles = StyleSheet.create({
  container: {
    backgroundColor: ColorPallet.grayscale.white,
    margin: 20,
  },
  bodyText: {
    ...TextTheme.normal,
    flexShrink: 1,
  },
  spacer: {
    height: 40,
  },
})

const ListContacts: React.FC = () => {
  const { connections } = useConnections()
  const { t } = useTranslation()
  const [searchText, setSearchText] = useState('')
  const [filteredData, setFilteredData] = useState([])

  const search = text => {
    const filteredData = connections.filter(item => {
      const orgLabel = item.theirLabel.toUpperCase()
      const textData = text.toUpperCase()
      return orgLabel.indexOf(textData) > -1
    })
    setFilteredData(filteredData)
    setSearchText(text)
  }

  return (
    <View style={styles.container}>
      <SearchBar
        round
        lightTheme
        placeholder="Search..."
        autoCapitalize="none"
        autoCorrect={false}
        onChangeText={text => search(text)}
        value={searchText}
        onBlur={undefined}
        onFocus={undefined}
        platform="ios"
        onClear={undefined}
        loadingProps={undefined}
        autoCompleteType={undefined}
        clearIcon={undefined}
        searchIcon={undefined}
        showLoading={undefined}
        onCancel={undefined}
        cancelButtonTitle={undefined}
        cancelButtonProps={undefined}
        showCancel={undefined}
      />
      <FlatList
        data={
          filteredData && filteredData.length > 0 ? filteredData : connections
        }
        renderItem={({ item }) => <ContactListItem contact={item} />}
        keyExtractor={(item: ConnectionRecord) => item.did}
        style={{ backgroundColor: ColorPallet.grayscale.white }}
        contentContainerStyle={{ paddingBottom: 65 }}
        ListEmptyComponent={
          <Text style={{ textAlign: 'center', margin: 100 }}>
            {t('Global.NoneYet!')}
          </Text>
        }
      />
    </View>
  )
}

export default ListContacts
