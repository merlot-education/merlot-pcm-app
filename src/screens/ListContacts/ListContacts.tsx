import { ConnectionRecord } from '@aries-framework/core';
import { useAgent, useConnections } from '@aries-framework/react-hooks';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, StyleSheet, View } from 'react-native';
import { useIsFocused } from '@react-navigation/core';
import SearchBar from '../../components/inputs/SearchBar';
import { ContactListItem, Text } from '../../components';
import { ColorPallet } from '../../theme/theme';
import { searchConnectionList } from './ListContacts.utils';

const ListContacts: React.FC = () => {
  const { connections } = useConnections();
  const { agent } = useAgent();
  const { t } = useTranslation();
  const [searchText, setSearchText] = useState('');
  const [connectionList, setConnectionList] = useState<ConnectionRecord[]>([]);

  const isFocused = useIsFocused();

  const [clicked, setClicked] = useState(false);

  const fetchConnectionRecords = useCallback(async () => {
    const records = await agent?.connections.getAll();
    if (records) {
      setConnectionList(records);
    }
  }, [agent?.connections]);

  useEffect(() => {
    if (isFocused) {
      fetchConnectionRecords();
    }
  }, [fetchConnectionRecords, isFocused, connections]);

  const search = (text: string) => {
    const filteredData = searchConnectionList(connections, text);
    setConnectionList(filteredData);
    setSearchText(text);
  };

  return (
    <View style={styles.container}>
      <SearchBar
        searchPhrase={searchText}
        setSearchPhrase={setSearchText => search(setSearchText)}
        clicked={clicked}
        setClicked={setClicked}
      />
      <FlatList
        data={connectionList}
        renderItem={({ item }) => (
          <ContactListItem key={item.id} contact={item} />
        )}
        keyExtractor={(item: ConnectionRecord) => item.id}
        style={{ backgroundColor: ColorPallet.grayscale.white }}
        contentContainerStyle={{ paddingBottom: 65 }}
        ListEmptyComponent={
          <Text style={{ textAlign: 'center', margin: 100 }}>
            {t('Global.ZeroRecords')}
          </Text>
        }
      />
    </View>
  );
};

export default ListContacts;

const styles = StyleSheet.create({
  container: {
    backgroundColor: ColorPallet.grayscale.white,
    margin: 20,
  },
});
