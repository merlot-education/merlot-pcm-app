import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View, Text } from 'react-native';
import { ColorPallet, TextTheme } from '../theme/theme';
import OpenURLButton from './links/OpenUrlButton';

const LegalAndPrivacyLinks = () => {
  const { t } = useTranslation();
  return (
    <View>
      <View style={styles.acceptTerms}>
        <Text style={styles.termsText}>{t<string>('Terms.AcceptTerms')}</Text>
      </View>
      <View style={styles.acceptTermsContinue}>
        <Text style={styles.termsText}>
          {t<string>('Terms.AcceptTermsContinue')}
        </Text>
      </View>
      <OpenURLButton url="https://gitlab.com/gaia-x/data-infrastructure-federation-services/pcm/app/-/blob/main/GDPR.md">
        <View style={styles.link}>
          <Text style={styles.linkText}>Privacy Policy</Text>
        </View>
      </OpenURLButton>
      <OpenURLButton url="https://gitlab.com/gaia-x/data-infrastructure-federation-services/pcm/app/-/blob/main/LICENSE">
        <View style={styles.link}>
          <Text style={styles.linkText}>Apache License Version 2.0</Text>
        </View>
      </OpenURLButton>
    </View>
  );
};

export default LegalAndPrivacyLinks;

const styles = StyleSheet.create({
  acceptTerms: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  acceptTermsContinue: {
    paddingTop: 8,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  termsText: {
    ...TextTheme.normal,
    fontWeight: 'bold',
  },
  link: {
    marginVertical: 14,
    padding: 20,
    alignItems: 'center',
  },
  linkText: {
    ...TextTheme.normal,
    fontWeight: 'bold',
    color: ColorPallet.brand.primary,
    textDecorationLine: 'underline',
  },
});
