import type { ConnectionRecord } from '@aries-framework/core'
import { useConnections } from '@aries-framework/react-hooks'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FlatList, StyleSheet, View } from 'react-native'
import SearchBar from '../components/inputs/SearchBar'
import { ContactListItem, Text } from '../components'
import { Colors } from '../theme/theme'

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    margin: 20,
  },
})

const ListContacts: React.FC = () => {
  const { connections } = useConnections()
  const { t } = useTranslation()
  const [searchText, setSearchText] = useState('')
  const [filteredData, setFilteredData] = useState(connections)
  const [clicked, setClicked] = useState(false)
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
        searchPhrase={searchText}
        setSearchPhrase={setSearchText => search(setSearchText)}
        clicked={clicked}
        setClicked={setClicked}
      />
      <FlatList
        data={filteredData}
        renderItem={({ item }) => <ContactListItem contact={item} />}
        keyExtractor={(item: ConnectionRecord) => item.did}
        style={{ backgroundColor: Colors.background }}
        contentContainerStyle={{ paddingBottom: 65 }}
        ListEmptyComponent={
          <Text style={{ textAlign: 'center', margin: 100 }}>
            {t('Global.ZeroRecords')}
          </Text>
        }
      />
    </View>
  )
}

export default ListContacts
