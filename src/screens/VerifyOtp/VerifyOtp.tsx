import React, { useState, useEffect } from 'react';
import { Keyboard, StyleSheet, Text, View, Image } from 'react-native';
import { useTranslation } from 'react-i18next';
import { StackScreenProps } from '@react-navigation/stack';
import { ColorPallet, TextTheme } from '../../theme/theme';
import {
  TextInput,
  Loader,
  InfoCard,
  ScreenNavigatorButtons,
} from '../../components';
import { OnboardingStackParams, Screens } from '../../types/navigators';
import { verifyOtp, registerUser } from './VerifyOtp.utils';
import Images from '../../assets';

type VerifyOtpProps = StackScreenProps<
  OnboardingStackParams,
  Screens.VerifyOtp
>;

const RESEND_OTP_TIME_LIMIT = 60; // 60 secs

let resendOtpTimerInterval: any;

const VerifyOtp: React.FC<VerifyOtpProps> = ({ navigation, route }) => {
  const { email, forgotPin, otpId } = route.params;
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [verifyOTPId, setVerifyOTPId] = useState(otpId);
  const [otpCorrect, setOtpCorrect] = useState(false);
  const [otpWrong, setOtpWrong] = useState(false);
  const [error, setError] = useState('');

  const { t } = useTranslation();

  // in secs, if value is greater than 0 then button will be disabled
  const [resendButtonDisabledTime, setResendButtonDisabledTime] = useState(
    RESEND_OTP_TIME_LIMIT,
  );

  const startResendOtpTimer = () => {
    if (resendOtpTimerInterval) {
      clearInterval(resendOtpTimerInterval);
    }
    resendOtpTimerInterval = setInterval(() => {
      if (resendButtonDisabledTime <= 0) {
        clearInterval(resendOtpTimerInterval);
      } else {
        setResendButtonDisabledTime(resendButtonDisabledTime - 1);
      }
    }, 1000);
  };

  useEffect(() => {
    startResendOtpTimer();

    return () => {
      if (resendOtpTimerInterval) {
        clearInterval(resendOtpTimerInterval);
      }
    };
  });

  const verifyOtpSubmit = async () => {
    Keyboard.dismiss();
    if (otp.length !== 6) {
      return;
    }
    const otpCode = parseInt(otp, 10);
    setLoading(true);
    const { data } = await verifyOtp(verifyOTPId, otpCode);
    setLoading(false);
    if (data) {
      setOtpCorrect(true);
      setOtpWrong(false);
      setError(t<string>('Registration.OtpSuccess'));
    } else {
      setOtpWrong(true);
      setOtpCorrect(false);
      setError(t<string>('Registration.OtpInvalid'));
    }
  };

  const onResendOtpButtonPress = async () => {
    setResendButtonDisabledTime(RESEND_OTP_TIME_LIMIT);
    startResendOtpTimer();
    setLoading(true);
    const {
      data: { otpId },
      message,
    } = await registerUser(email, verifyOTPId);
    setLoading(false);
    setVerifyOTPId(otpId);
    setError(message);
  };

  const onBack = () => {
    if (forgotPin) {
      navigation.navigate(Screens.EnterPin);
    } else {
      navigation.navigate(Screens.Registration);
    }
  };

  return (
    <View style={[style.container]}>
      <Loader loading={loading} />
      <View style={style.innerContainer}>
        <TextInput
          label={t<string>('Global.Otp')}
          placeholder={t<string>('Global.Otp')}
          placeholderTextColor={ColorPallet.baseColors.lightGrey}
          accessible
          accessibilityLabel={t<string>('Global.Otp')}
          maxLength={6}
          autoFocus
          keyboardType="number-pad"
          returnKeyType="done"
          value={otp}
          onChangeText={setOtp}
          onSubmitEditing={verifyOtpSubmit}
        />
        <View style={style.imgContainer}>
          <Text style={[style.bodyText, style.verticalSpacer]}>
            {`${resendButtonDisabledTime} ${t<string>('Registration.SecondCounter')}`}
          </Text>
          {resendButtonDisabledTime === 0 && (
            <Text
              style={[style.bodyText, style.verticalSpacer]}
              onPress={onResendOtpButtonPress}
            >
              {t<string>('Registration.ResendOtp')}
            </Text>
          )}

          {otpWrong && (
            <Image source={Images.wrongOtpIcon} style={style.emailImg} />
          )}
          {otpCorrect && (
            <Image source={Images.correctOtpIcon} style={style.emailImg} />
          )}
        </View>
      </View>
      <View style={style.bottomContainer}>
        <View>
          <InfoCard showBottomIcon={false} showTopIcon errorMsg={error}>
            {t<string>('Registration.OtpInfo')}
          </InfoCard>
        </View>
        <ScreenNavigatorButtons
          onLeftPress={onBack}
          onRightPress={() =>
            navigation.navigate(Screens.CreatePin, { forgotPin })
          }
          isRightDisabled={!otpCorrect}
        />
      </View>
    </View>
  );
};

export default VerifyOtp;

const style = StyleSheet.create({
  container: {
    backgroundColor: ColorPallet.grayscale.white,
    margin: 20,
    flex: 1,
    justifyContent: 'space-between',
  },
  bodyText: {
    ...TextTheme.normal,
    flexShrink: 1,
  },
  verticalSpacer: {
    textAlign: 'center',
    marginBottom: 20,
  },
  emailImg: {
    height: 95,
    width: 95,
    alignSelf: 'center',
  },
  innerContainer: {
    flex: 0.5,
    justifyContent: 'space-between',
  },
  bottomContainer: {
    flex: 0.5,
    justifyContent: 'space-between',
  },
  imgContainer: {
    flex: 1,
    justifyContent: 'center',
  },
});
