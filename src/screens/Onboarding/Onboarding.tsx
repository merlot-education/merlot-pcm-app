import { useFocusEffect, useNavigation } from '@react-navigation/native';
import React, { ReactNode, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
  BackHandler,
  ImageSourcePropType,
} from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTranslation } from 'react-i18next';
import { ColorPallet, TextTheme } from '../../theme/theme';
import { storeAppIntroCompleteStage } from './Onboarding.utils';
import { Screens } from '../../types/navigators';
import Images from '../../assets';

interface ISlide {
  key: number;
  title: string;
  text: string;
  image: ImageSourcePropType;
}

const slides: ISlide[] = [
  {
    key: 1,
    title: 'Credentials List',
    text: 'Get the list of issued credentials',
    image: Images.credentialListImage,
  },
  {
    key: 2,
    title: 'Scan to connect',
    text: 'Scan QR to connect to organizations',
    image: Images.scanToConnectImage,
  },
  {
    key: 3,
    title: 'Secure Storage',
    text: 'Store your credentials securely in wallet',
    image: Images.secureImage,
  },
];

const Onboarding: React.FC = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();

  const renderItem = ({ item }: { item: ISlide }) => {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{item.title}</Text>
        <Image source={item.image} style={styles.image} />
        <Text style={styles.text}>{item.text}</Text>
      </View>
    );
  };

  const keyExtractor = (item: ISlide) => item.title;

  const renderNextButton = () => {
    return (
      <View style={styles.buttonCircle}>
        <Icon name="east" color={ColorPallet.grayscale.white} size={28} />
      </View>
    );
  };
  const renderDoneButton = () => {
    return (
      <View style={styles.buttonCircle}>
        <Icon
          name="check"
          color={ColorPallet.grayscale.white}
          size={28}
          onPress={onDone}
        />
      </View>
    );
  };
  const renderSkipButton = () => {
    return (
      <View>
        <Text style={styles.textButton} onPress={onDone}>
          {t<string>('Global.Skip')}
        </Text>
      </View>
    );
  };
  const renderPrevButton = () => {
    return (
      <View style={styles.buttonCircle}>
        <Icon name="west" color={ColorPallet.grayscale.white} size={28} />
      </View>
    );
  };
  const onDone = async () => {
    // User finished the introduction. Show real app through
    // navigation or simply by controlling state
    await storeAppIntroCompleteStage();
    navigation.navigate(Screens.Terms);
  };

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        BackHandler.exitApp();
        return true;
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, []),
  );

  return (
    <View style={{ flex: 1 }}>
      <AppIntroSlider
        activeDotStyle={{ backgroundColor: ColorPallet.grayscale.darkGrey }}
        keyExtractor={keyExtractor}
        renderDoneButton={renderDoneButton}
        renderNextButton={renderNextButton}
        renderSkipButton={renderSkipButton}
        renderPrevButton={renderPrevButton}
        showPrevButton
        showSkipButton
        renderItem={renderItem}
        data={slides}
      />
    </View>
  );
};

export default Onboarding;

const styles = StyleSheet.create({
  container: {
    backgroundColor: ColorPallet.grayscale.white,
    margin: 10,
    flex: 0.75,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    flex: 0.65,
    width: 300,
    height: 70,
    resizeMode: 'contain',
  },
  text: {
    ...TextTheme.normal,
    flexShrink: 1,
    textAlign: 'center',
  },
  title: {
    ...TextTheme.normal,
    flexShrink: 1,
    textAlign: 'center',
  },
  buttonCircle: {
    width: 44,
    height: 44,
    backgroundColor: ColorPallet.brand.primary,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textButton: {
    marginTop: 12,
    marginLeft: 5,
    ...TextTheme.normal,
  },
});
