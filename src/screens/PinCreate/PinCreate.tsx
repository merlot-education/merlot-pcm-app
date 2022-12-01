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
  getValueFromKeychain,
  saveValueInKeychain,
  createMD5HashFromString,
} from './PinCreate.utils';
import Images from '../../assets';

type PinCreateProps = StackScreenProps<
  OnboardingStackParams,
  Screens.CreatePin
>;

const PinCreate: React.FC<PinCreateProps> = ({ navigation, route }) => {
  const { initAgent, forgotPin } = route.params;
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

  const startAgentForgotPin = useCallback(async () => {
    const [email, passphrase, passcode] = (await Promise.all([
      new Promise(resolve => {
        resolve(getValueFromKeychain(KeychainStorageKeys.Email));
      }),
      new Promise(resolve => {
        resolve(getValueFromKeychain(KeychainStorageKeys.Passphrase));
      }),
      new Promise(resolve => {
        resolve(getValueFromKeychain(KeychainStorageKeys.Passcode));
      }),
    ])) as UserCredentials[];
    if (email && passphrase) {
      const rawValue = email + passphrase.password.replace(/ /g, '');
      const seedHash = createMD5HashFromString(rawValue);
      await initAgent(email.password, passcode.password, seedHash);
      setLoading(false);
    }
  }, [initAgent]);

  const forgotPinEffect = useCallback(async () => {
    if (forgotPin) {
      await startAgentForgotPin();
    }
  }, [forgotPin, startAgentForgotPin]);

  useEffect(() => {
    forgotPinEffect();
  }, [forgotPinEffect]);

  const passcodeCreate = async (passcode: string) => {
    try {
      const [email, oldPasscode] = (await Promise.all([
        new Promise(resolve => {
          resolve(getValueFromKeychain(KeychainStorageKeys.Email));
        }),
        new Promise(resolve => {
          resolve(getValueFromKeychain(KeychainStorageKeys.Passcode));
        }),
        new Promise(resolve => {
          resolve(
            saveValueInKeychain(
              KeychainStorageKeys.Passcode,
              passcode,
              t('PinCreate.UserAuthenticationPin'),
            ),
          );
        }),
      ])) as UserCredentials[];

      if (forgotPin) {
        setLoading(true);
        await agent?.shutdown();
        await agent?.wallet.rotateKey({
          id: email.password,
          key: oldPasscode.password,
          rekey: passcode,
        });
        await agent?.initialize();
        setLoading(false);
        navigation.navigate(Screens.EnterPin);
      } else if (biometricSensorAvailable) {
        navigation.navigate(Screens.Biometric);
      } else {
        navigation.navigate(Screens.Initialization);
      }

      setError(t('PinCreate.PinsSuccess'));
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
          navigation.navigate(Screens.Registration, { forgotPin: false }),
      },
    ]);
    return true;
  }, [navigation]);

  const backActionForgotPassword = useCallback(() => {
    navigation.navigate(Screens.EnterPin);
    return true;
  }, [navigation]);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      forgotPin ? backActionForgotPassword : backAction,
    );

    return () => backHandler.remove();
  }, [backAction, backActionForgotPassword, forgotPin]);

  const confirmEntry = async (pin: string, reEnterPin: string) => {
    if (pin.length < 6) {
      setError(t('PinCreate.PinMustBe6DigitsInLength'));
    } else if (reEnterPin.length < 6) {
      setError(t('PinCreate.ReEnterPinMustBe6DigitsInLength'));
    } else if (pin !== reEnterPin) {
      setError(t('PinCreate.PinsEnteredDoNotMatch'));
    } else {
      await passcodeCreate(pin);
    }
  };

  const onBack = () => {
    if (forgotPin) {
      backActionForgotPassword();
    } else {
      backAction();
    }
  };

  return (
    <View style={[style.container]}>
      <Loader loading={loading} />
      <View style={{ flex: 0.5 }}>
        <View style={style.innerContainer}>
          <View style={{ width: '70%' }}>
            <TextInput
              label={t('Global.EnterPin')}
              placeholder={t('Global.6DigitPin')}
              placeholderTextColor={ColorPallet.baseColors.lightGrey}
              accessible
              accessibilityLabel={t('Global.EnterPin')}
              maxLength={6}
              autoFocus
              secureTextEntry
              keyboardType="number-pad"
              value={pin}
              onChangeText={setPin}
              returnKeyType="done"
            />
            <TextInput
              label={t('PinCreate.ReenterPin')}
              accessible
              accessibilityLabel={t('PinCreate.ReenterPin')}
              placeholder={t('Global.6DigitPin')}
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
          {t('PinCreate.PinInfo')}
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
