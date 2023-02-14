import React, { useCallback } from 'react';
import { BackHandler, StyleSheet, View } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/core';
import { Screens } from '../../types/navigators';
import {
  storeTermsCompleteStage,
  restoreAppIntroCompleteStage,
} from './Terms.utils';
import { ScreenNavigatorButtons } from '../../components';
import LegalAndPrivacyLinks from '../../components/LegalAndPrivacyLinks';
import { ColorPallet } from '../../theme/theme';

const Terms: React.FC = () => {
  const nav = useNavigation();
  let backCount = 0;

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
      <LegalAndPrivacyLinks />
      <View style={styles.bottom}>
        <ScreenNavigatorButtons
          onLeftPress={onBack}
          onRightPress={onSubmitPressed}
        />
      </View>
    </View>
  );
};

export default Terms;

const styles = StyleSheet.create({
  container: {
    backgroundColor: ColorPallet.grayscale.white,
    margin: 20,
    flex: 1,
  },
  bottom: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: 'white',
    width: '100%',
  },
});
