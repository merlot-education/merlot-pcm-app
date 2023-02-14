import React from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View, Alert } from 'react-native';
import { getVersion, getBuildNumber } from 'react-native-device-info';
import { borderRadius, ColorPallet, TextTheme } from '../theme/theme';
import { Screens, SettingStackParams } from '../types/navigators';
import { SettingListItem, Text } from '../components';

type SettingsProps = {
  navigation: StackScreenProps<SettingStackParams, Screens.Settings>;
  setAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
};

const Settings: React.FC<SettingsProps> = ({
  navigation,
  setAuthenticated,
}) => {
  const { t } = useTranslation();
  const logoff = () =>
    Alert.alert(t<string>('Settings.Logout'), t<string>('Settings.LogoutMsg'), [
      {
        text: t<string>('Settings.Yes'),
        onPress: () => setAuthenticated(false),
      },
      { text: t<string>('Settings.No') },
    ]);
  return (
    <View style={styles.container}>
      <Text style={styles.groupHeader}>
        {t<string>('Settings.AppPreferences')}
      </Text>
      <SettingListItem
        title={t<string>('Settings.ChangePin')}
        onPress={() => navigation.navigate(Screens.ChangePin)}
      />
      <SettingListItem
        title={t<string>('Settings.Language')}
        onPress={() => navigation.navigate(Screens.Language)}
      />
      <SettingListItem
        title={t<string>('Settings.ViewMnemonic')}
        onPress={() => navigation.navigate(Screens.ViewMnemonic)}
      />
      <SettingListItem
        title={t<string>('Settings.ExportWallet')}
        onPress={() => navigation.navigate(Screens.ExportWallet)}
      />
      <SettingListItem
        title={t<string>('Settings.LegalAndPrivacy')}
        onPress={() => navigation.navigate(Screens.LegalAndPrivacy)}
      />
      <SettingListItem title={t<string>('Settings.Logout')} onPress={logoff} />
      <Text style={styles.groupHeader}>{t<string>('Settings.AboutApp')}</Text>
      <View style={styles.rowGroup}>
        <View style={styles.row}>
          <Text style={styles.bodyText}>{t<string>('Settings.Version')}</Text>
          <Text
            style={styles.bodyText}
          >{`${getVersion()}.${getBuildNumber()}`}</Text>
        </View>
      </View>
    </View>
  );
};

export default Settings;

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
    color: ColorPallet.baseColors.black,
  },
  rowGroup: {
    borderRadius: borderRadius * 2,
    backgroundColor: ColorPallet.baseColors.lightBlue,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
  },
});
