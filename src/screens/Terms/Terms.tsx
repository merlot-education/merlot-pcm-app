import React, { useCallback, useState } from 'react';
import { BackHandler, StyleSheet, View, ScrollView } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/core';
import { useTranslation } from 'react-i18next';
import CheckBoxRow from '../../components/checkbox/CheckBoxRow';
import InfoTextBox from '../../components/text/InfoTextBox';
import { ColorPallet, TextTheme } from '../../theme/theme';
import { Screens } from '../../types/navigators';
import {
  storeTermsCompleteStage,
  restoreAppIntroCompleteStage,
} from './Terms.utils';
import { InfoCard, ScreenNavigatorButtons } from '../../components';

const Terms: React.FC = () => {
  const [checked, setChecked] = useState(false);
  const nav = useNavigation();
  let backCount = 0;

  const { t } = useTranslation();

  const onSubmitPressed = async () => {
    await storeTermsCompleteStage();
    nav.navigate(Screens.CreatePin);
  };

  const onBack = async () => {
    await restoreAppIntroCompleteStage();
    nav.navigate(Screens.Onboarding);
  };
  useFocusEffect(
    useCallback(() => {
      const onBackPress = async () => {
        // eslint-disable-next-line no-plusplus
        backCount++;
        if (backCount === 1) {
          await restoreAppIntroCompleteStage();
          nav.navigate(Screens.Onboarding);
        } else {
          BackHandler.exitApp();
        }

        return true;
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [backCount, nav]),
  );
  return (
    <View style={styles.container}>
      <ScrollView>
        <InfoTextBox showIcon>{t<string>('Terms.AcceptTerms')}</InfoTextBox>
        <View style={styles.verticalSpacer}>
          <InfoCard showBottomIcon>
            {t<string>('Terms.TermsAndConditions')}
          </InfoCard>
        </View>
      </ScrollView>
      <View style={styles.bottom}>
        <CheckBoxRow
          title={t<string>('Terms.Attestation')}
          accessibilityLabel="I Agree"
          checked={checked}
          onPress={() => setChecked(!checked)}
        />
        <ScreenNavigatorButtons
          onLeftPress={onBack}
          onRightPress={onSubmitPressed}
          isRightDisabled={!checked}
        />
      </View>
    </View>
  );
};

export default Terms;

const styles = StyleSheet.create({
  scrollView: {
    height: 200,
  },
  container: {
    backgroundColor: ColorPallet.grayscale.white,
    margin: 20,
    flex: 1,
  },
  bodyText: {
    ...TextTheme.normal,
    flexShrink: 1,
  },
  verticalSpacer: {
    marginVertical: 20,
    height: 420,
  },
  topSpacer: {
    paddingTop: 10,
  },
  bottom: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: 'white',
    width: '100%',
  },
});
