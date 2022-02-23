/* eslint-disable prettier/prettier */
/* eslint-disable react/no-unstable-nested-components */

import { useNavigation } from '@react-navigation/native'
import React, { useState } from 'react'
import { StyleSheet, View, Text } from 'react-native'
import AppIntroSlider from 'react-native-app-intro-slider'

const slides = [
  {
    key: 1,
    title: 'Title 1',
    text: 'Description.\nSay something cool',
    // image: require('./assets/1.jpg'),
    backgroundColor: '#59b2ab',
  },
  {
    key: 2,
    title: 'Title 2',
    text: 'Other cool stuff',
    // image: require('./assets/2.jpg'),
    backgroundColor: '#febe29',
  },
  {
    key: 3,
    title: 'Rocket guy',
    text: "I'm already out of descriptions\n\nLorem ipsum bla bla bla",
    image: require('../assets/3.png'),
    backgroundColor: '#22bcb5',
  },
]

const Onboarding: React.FC = () => {
  const [showRealApp, setShowRealApp] = useState(false)
  const navigation = useNavigation()
  const _renderItem = ({ item }) => {
    return (
      <View>
        <Text>{item.title}</Text>
        {/* <Image source={item.image} /> */}
        <Text>{item.text}</Text>
      </View>
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
