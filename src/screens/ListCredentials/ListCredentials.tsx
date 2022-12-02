import {
  CredentialState,
  CredentialExchangeRecord,
} from '@aries-framework/core';
import { useCredentialByState } from '@aries-framework/react-hooks';
import React, { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, View, StyleSheet } from 'react-native';
import { Text } from '../../components';
import { ColorPallet, TextTheme } from '../../theme/theme';
import CredentialListItem from '../../components/listItems/CredentialListItem';
import SearchBar from '../../components/inputs/SearchBar';
import { parsedSchema } from '../../utils/helpers';

const ListCredentials: React.FC = () => {
  const credentials = useCredentialByState(CredentialState.Done);

  const { t } = useTranslation();
  const [searchPhrase, setSearchPhrase] = useState('');
  const [clicked, setClicked] = useState(false);
  const [filteredData, setFilteredData] = useState(credentials);

  const refreshFilteredData = useCallback(() => {
    setFilteredData(filteredData);
  }, [filteredData]);
  // Should not ever set state during rendering, so do this in useEffect instead.
  useEffect(() => {
    if (filteredData.length < credentials.length) {
      refreshFilteredData();
    }
  }, [filteredData, credentials.length, refreshFilteredData]);

  const search = (text: string) => {
    const filteredData = credentials.filter(item => {
      const orgLabel = parsedSchema(item).name.toUpperCase();
      const textData = text.toUpperCase();
      return orgLabel.indexOf(textData) > -1;
    });

    setFilteredData(filteredData);
    setSearchPhrase(text);
  };

  const emptyListComponent = () => (
    <Text style={{ textAlign: 'center', marginTop: 100 }}>
      {t('Global.ZeroRecords')}
    </Text>
  );

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
        data={filteredData}
        keyExtractor={(item: CredentialExchangeRecord) => item?.id}
        ListEmptyComponent={emptyListComponent}
        renderItem={({ item, index }) => (
          <View
            style={{
              marginHorizontal: 15,
              marginTop: 15,
              marginBottom: index === filteredData.length - 1 ? 45 : 0,
            }}
            key={index.toString()}
          >
            <CredentialListItem key={index.toString()} credential={item} />
          </View>
        )}
      />
    </View>
  );
};

export default ListCredentials;

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
});
