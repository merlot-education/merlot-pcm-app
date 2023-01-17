import React, { useState, useEffect, useCallback } from 'react';
import {
  Keyboard,
  StyleSheet,
  View,
  Image,
  BackHandler,
  Alert,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { StackScreenProps } from '@react-navigation/stack';
import { useAgent } from '@aries-framework/react-hooks';
import { UserCredentials } from 'react-native-keychain';
import { ColorPallet, TextTheme } from '../../theme/theme';
import {
  Loader,
  TextInput,
  InfoCard,
  ScreenNavigatorButtons,
} from '../../components';
import { KeychainStorageKeys } from '../../constants';
import { OnboardingStackParams, Screens } from '../../types/navigators';
import {
  checkIfSensorAvailable,
  createMD5HashFromString,
} from './PinCreate.utils';
import { getValueFromKeychain, saveValueInKeychain } from '../../utils/generic';
import Images from '../../assets';

type PinCreateProps = StackScreenProps<
  OnboardingStackParams,
  Screens.CreatePin
>;

const PinCreate: React.FC<PinCreateProps> = ({ navigation, route }) => {
  const { initAgent } = route.params;
  const [pin, setPin] = useState('');
  const [pinTwo, setPinTwo] = useState('');
  const [biometricSensorAvailable, setBiometricSensorAvailable] =
    useState(false);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const { agent } = useAgent();
  const [error, setError] = useState('');

  const checkBiometricIfPresent = useCallback(async () => {
    const { available } = await checkIfSensorAvailable();
    if (available) {
      setBiometricSensorAvailable(true);
    }
  }, []);

  useEffect(() => {
    checkBiometricIfPresent();
  }, [checkBiometricIfPresent]);

  const passcodeCreate = async (passcode: string) => {
    try {
      await saveValueInKeychain(
        KeychainStorageKeys.Passcode,
        passcode,
        t<string>('PinCreate.UserAuthenticationPin'),
      );

      if (biometricSensorAvailable) {
        navigation.navigate(Screens.Biometric);
      } else {
        navigation.navigate(Screens.Initialization);
      }

      setError(t<string>('PinCreate.PinsSuccess'));
    } catch (e: any) {
      setError(e);
    }
  };
  const backAction = useCallback(() => {
    Alert.alert('Already authenticated!', 'Are you sure you want to go back?', [
      {
        text: 'Cancel',
        onPress: () => null,
        style: 'cancel',
      },
      {
        text: 'YES',
        onPress: () =>
          navigation.navigate(Screens.Terms),
      },
    ]);
    return true;
  }, [navigation]);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, [backAction]);

  const confirmEntry = async (pin: string, reEnterPin: string) => {
    if (pin.length < 6) {
      setError(t<string>('PinCreate.PinMustBe6DigitsInLength'));
    } else if (reEnterPin.length < 6) {
      setError(t<string>('PinCreate.ReEnterPinMustBe6DigitsInLength'));
    } else if (pin !== reEnterPin) {
      setError(t<string>('PinCreate.PinsEnteredDoNotMatch'));
    } else {
      await passcodeCreate(pin);
    }
  };

  const onBack = () => {
    backAction();
  };

  return (
    <View style={[style.container]}>
      <Loader loading={loading} />
      <View style={{ flex: 0.5 }}>
        <View style={style.innerContainer}>
          <View style={{ width: '70%' }}>
            <TextInput
              label={t<string>('Global.EnterPin')}
              placeholder={t<string>('Global.6DigitPin')}
              placeholderTextColor={ColorPallet.baseColors.lightGrey}
              accessible
              accessibilityLabel={t<string>('Global.EnterPin')}
              maxLength={6}
              autoFocus
              secureTextEntry
              keyboardType="number-pad"
              value={pin}
              onChangeText={setPin}
              returnKeyType="done"
            />
            <TextInput
              label={t<string>('PinCreate.ReenterPin')}
              accessible
              accessibilityLabel={t<string>('PinCreate.ReenterPin')}
              placeholder={t<string>('Global.6DigitPin')}
              placeholderTextColor={ColorPallet.baseColors.lightGrey}
              maxLength={6}
              secureTextEntry
              keyboardType="number-pad"
              returnKeyType="done"
              value={pinTwo}
              onChangeText={(text: string) => {
                setPinTwo(text);
                if (text.length === 6) {
                  Keyboard.dismiss();
                }
              }}
              editable={pin.length === 6 && true}
            />
          </View>
          <View style={style.pinImgView}>
            <Image source={Images.pinIcon} style={style.pinImg} />
          </View>
        </View>
      </View>
      <View style={style.bottomContainer}>
        <InfoCard showBottomIcon={false} showTopIcon errorMsg={error}>
          {t<string>('PinCreate.PinInfo')}
        </InfoCard>
        <ScreenNavigatorButtons
          onLeftPress={onBack}
          onRightPress={() => confirmEntry(pin, pinTwo)}
        />
      </View>
    </View>
  );
};

export default PinCreate;

const style = StyleSheet.create({
  container: {
    backgroundColor: ColorPallet.grayscale.white,
    margin: 20,
    flex: 1,
    justifyContent: 'space-between',
  },
  btnContainer: {
    marginTop: 20,
  },
  label: {
    ...TextTheme.label,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  pinImg: {
    height: 95,
    width: 70,
    marginTop: 20,
    alignSelf: 'flex-end',
  },
  pinImgView: {
    justifyContent: 'center',
    flex: 1,
    alignItems: 'center',
  },
  innerContainer: {
    flexDirection: 'row',
  },
  bottomContainer: {
    flex: 0.5,
    justifyContent: 'space-between',
  },
});
