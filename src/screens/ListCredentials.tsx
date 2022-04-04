import { CredentialState, CredentialRecord } from '@aries-framework/core'
import { useCredentialByState } from '@aries-framework/react-hooks'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FlatList, View, StyleSheet } from 'react-native'
import { Text } from '../components'
import { ColorPallet, TextTheme } from '../theme/theme'
import CredentialListItem from '../components/listItems/CredentialListItem'
import SearchBar from '../components/inputs/SearchBar'
import { parsedCredentialDefinition } from '../utils/helpers'

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

const ListCredentials: React.FC = () => {
  const credentials = [
    ...useCredentialByState(CredentialState.CredentialReceived),
    ...useCredentialByState(CredentialState.Done),
  ]
  const { t } = useTranslation()
  const [searchPhrase, setSearchPhrase] = useState('')
  const [clicked, setClicked] = useState(false)
  const [filteredData, setFilteredData] = useState(credentials)

  const search = text => {
    const filteredData = credentials.filter(item => {
      const orgLabel = parsedCredentialDefinition(item).name
      const textData = text.toUpperCase()
      return orgLabel.indexOf(textData) > -1
    })
    setFilteredData(filteredData)
    setSearchPhrase(text)
  }

  const emptyListComponent = () => (
    <Text style={{ textAlign: 'center', marginTop: 100 }}>
      {t('Global.ZeroRecords')}
    </Text>
  )

  return (
    <View style={styles.container}>
      <SearchBar
        searchPhrase={searchPhrase}
        setSearchPhrase={setSearchPhrase => search(setSearchPhrase)}
        clicked={clicked}
        setClicked={setClicked}
      />
      <FlatList
        style={{ backgroundColor: ColorPallet.grayscale.white }}
        data={filteredData.sort(
          (issuedDate, acceptanceDate) =>
            new Date(acceptanceDate.createdAt).valueOf() -
            new Date(issuedDate.createdAt).valueOf(),
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
    </View>
  )
}

export default ListCredentials
