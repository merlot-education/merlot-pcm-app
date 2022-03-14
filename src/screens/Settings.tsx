import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, TouchableOpacity, View, Text } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'

import { borderRadius, Colors, TextTheme } from '../theme/theme'
import { Screens } from '../types/navigators'

interface Props {
  navigation: any
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 20,
  },
  groupHeader: {
    ...TextTheme.normal,
    marginBottom: 8,
  },
  bodyText: {
    ...TextTheme.normal,
    flexShrink: 1,
    color: Colors.white,
  },
  rowGroup: {
    borderRadius: borderRadius * 2,
    backgroundColor: Colors.primary,
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
  },
})

const Settings: React.FC<Props> = ({ navigation }) => {
  const { t } = useTranslation()

  return (
    <View style={styles.container}>
      <View style={styles.rowGroup}>
        <TouchableOpacity
          style={styles.row}
          onPress={() => navigation.navigate(Screens.ChangePin)}
        >
          <Text style={styles.bodyText}>{t('Global.ChangePin')}</Text>
          <Icon name="chevron-right" size={25} color={Colors.white} />
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default Settings
