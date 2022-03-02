/* eslint-disable prettier/prettier */
/* eslint-disable react/no-unstable-nested-components */

import { useNavigation } from '@react-navigation/native'
import React, { useState } from 'react'
import { StyleSheet, View, Text } from 'react-native'
import AppIntroSlider from 'react-native-app-intro-slider'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Colors } from 'react-native/Libraries/NewAppScreen'
import { TextTheme } from '../theme/theme'

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    margin: 20,
  },
  bodyText: {
    ...TextTheme.normal,
    flexShrink: 1,
  },
  controlsWrapper: {
    marginTop: 15,
  },
  verticalSpacer: {
    marginVertical: 20,
  },
  topSpacer: {
    paddingTop: 10,
  },
})

const slides = [
  {
    key: 1,
    title: 'Title 1',
    text: 'Description.\nLorem ipsum',
    image: require('../assets/1.png'),
    backgroundColor: '#59b2ab',
  },
  {
    key: 2,
    title: 'Title 2',
    text: 'Description 2 ./n Lorem ipsum',
    image: require('../assets/2.png'),
    backgroundColor: '#febe29',
  },
  {
    key: 3,
    title: 'Title 3',
    text: "I'm already out of descriptions\n\nLorem ipsum ",
    image: require('../assets/3.png'),
    backgroundColor: '#22bcb5',
  },
]

const Onboarding: React.FC = () => {
  const [showRealApp, setShowRealApp] = useState(false)
  const navigation = useNavigation()
  const _renderItem = ({ item }) => {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.bodyText}>{item.title}</Text>
        {/* <Image source={item.image} /> */}
        <Text style={styles.bodyText}>{item.text}</Text>
        <Text style={styles.bodyText}>{item.text}</Text>
      </SafeAreaView>
    )
  }
  const _onDone = () => {
    // User finished the introduction. Show real app through
    // navigation or simply by controlling state
    navigation.navigate('Terms')
    setShowRealApp(true)
  }
  return (
    <AppIntroSlider renderItem={_renderItem} data={slides} onDone={_onDone} />
  )
}
export default Onboarding
