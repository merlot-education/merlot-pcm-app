import { useNavigation } from '@react-navigation/native'
import React, { useState, useContext } from 'react'
import { StyleSheet, View, Image, Text } from 'react-native'
import AppIntroSlider from 'react-native-app-intro-slider'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { ColorPallet, TextTheme } from '../theme/theme'
import { Context } from '../store/Store'
import CredentialListImage from '../assets/credential-list.png'
import ScanToConnectImage from '../assets/scan-share.png'
import SecureImage from '../assets/secure-image.png'
import { DispatchAction } from '../store/reducer'

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
    fontSize: 32,
    ...TextTheme.normal,
    flexShrink: 1,
    textAlign: 'center',
  },
  buttonCircle: {
    width: 44,
    height: 44,
    backgroundColor: 'rgba(0, 0, 0, .2)',
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
})

const slides = [
  {
    key: 1,
    title: 'Credentials List',
    text: 'Get the list of issued credentials',
    image: CredentialListImage,
  },
  {
    key: 2,
    title: 'Scan to connect',
    text: 'Scan QR to connect to organizations',
    image: ScanToConnectImage,
  },
  {
    key: 3,
    title: 'Secure Storage',
    text: "I'm already out of descriptions\n\nLorem ipsum ",
    image: SecureImage,
  },
]

const Onboarding: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0)
  const [showRealApp, setShowRealApp] = useState(false)
  const navigation = useNavigation()
  const [, dispatch] = useContext(Context)

  const renderItem = ({ item }: { item: Item }) => {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{item.title}</Text>
        <Image source={item.image} style={styles.image} />
        <Text style={styles.text}>{item.text}</Text>
      </View>
    )
  }
  const onNext = () => {
    if (activeIndex + 1 < slides.length) {
      setActiveIndex(activeIndex + 1)
    }
  }

  const keyExtractor = (item: Item) => item.title
  const renderNextButton = () => {
    return (
      <View style={styles.buttonCircle}>
        <Icon
          name="east"
          onPress={onNext}
          color="rgba(255, 255, 255, .9)"
          size={24}
        />
      </View>
    )
  }
  const renderDoneButton = () => {
    return (
      <View style={styles.buttonCircle}>
        <Icon
          name="check"
          color="rgba(255, 255, 255, .9)"
          size={24}
          onPress={onDone}
        />
      </View>
    )
  }
  const onDone = () => {
    // User finished the introduction. Show real app through
    // navigation or simply by controlling state
    dispatch({
      type: DispatchAction.SetTutorialCompletionStatus,
      payload: [{ DidCompleteTutorial: true }],
    })
    navigation.navigate('Terms')
    setShowRealApp(true)
  }

  return (
    <View style={{ flex: 1 }}>
      <AppIntroSlider
        keyExtractor={keyExtractor}
        renderDoneButton={renderDoneButton}
        renderNextButton={renderNextButton}
        renderItem={renderItem}
        data={slides}
      />
    </View>
  )
}
export default Onboarding
