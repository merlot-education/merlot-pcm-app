import { StackScreenProps } from '@react-navigation/stack'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'
import { getVersion, getBuildNumber } from 'react-native-device-info'
import { borderRadius, Colors, TextTheme } from '../theme/theme'
import { Screens, SettingStackParams } from '../types/navigators'
import { SettingListItem, Text } from '../components'

type SettingsProps = StackScreenProps<SettingStackParams>

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
    color: Colors.primary,
  },
  rowGroup: {
    borderRadius: borderRadius * 2,
    backgroundColor: Colors.primaryLight,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
  },
})

const Settings: React.FC<SettingsProps> = ({ navigation }) => {
  const { t } = useTranslation()

  return (
    <View style={styles.container}>
      <Text style={styles.groupHeader}>{t('Settings.AppPreferences')}</Text>
      <SettingListItem
        title={t('Settings.ChangePin')}
        onPress={() => navigation.navigate(Screens.ChangePin)}
      />
      <SettingListItem
        title={t('Settings.Language')}
        onPress={() => navigation.navigate(Screens.Language)}
      />
      <Text style={styles.groupHeader}>{t('Settings.AboutApp')}</Text>
      <View style={styles.rowGroup}>
        <View style={styles.row}>
          <Text style={styles.bodyText}>{t('Settings.Version')}</Text>
          <Text
            style={styles.bodyText}
          >{`${getVersion()}-${getBuildNumber()}`}</Text>
        </View>
      </View>
    </View>
  )
}

export default Settings
