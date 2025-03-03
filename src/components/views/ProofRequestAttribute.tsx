import React from 'react';
import { StyleSheet, View } from 'react-native';
import DropDown from '../listItems/DropDown';
import Text from '../text/Text';
import { TextTheme } from '../../theme/theme';
import { CredentialDisplay } from '../../types/record';

interface Props {
  proofRequest: CredentialDisplay[];
  onSelectItem: (item: any, key: string) => void;
}

const ProofRequestAttribute: React.FC<Props> = ({
  proofRequest,
  onSelectItem,
}: Props) => {
  return (
    <View testID="proofRequestAttribute">
      {proofRequest?.map((item: any) => (
        <View key={item.names[0]} style={styles.attributeView}>
          {item.names?.map((name: string, index: number) => (
            <View key={name} style={styles.credentialView}>
              <Text style={[TextTheme.normal, styles.nameText]}>{name} : </Text>
              <Text style={[TextTheme.normal, styles.valueText]}>
                {item.values[index]}
              </Text>
            </View>
          ))}
          {item.credentials.length <= 1 ? (
            <Text style={styles.credentialName}>
              {item.credentials[0].label}
            </Text>
          ) : (
            <View style={styles.dropdownContainer}>
              <DropDown
                items={item.credentials}
                onSelectItem={value => onSelectItem(value, item.key)}
              />
            </View>
          )}
        </View>
      ))}
    </View>
  );
};

export default ProofRequestAttribute;

const styles = StyleSheet.create({
  attributeView: {
    borderBottomWidth: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  credentialView: {
    flexDirection: 'row',
    width: '100%',
  },
  valueText: {
    flex: 1,
    textAlign: 'right',
  },
  nameText: {
    flex: 1,
    textAlign: 'left',
  },
  credentialName: {
    ...TextTheme.label,
    width: '100%',
    textAlign: 'left',
    marginTop: 8,
  },
  dropdownContainer: { marginTop: 8 },
});
