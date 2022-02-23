import React from 'react'
import { SafeAreaView, StyleSheet, View } from 'react-native'
import AppIntroSlider from 'react-native-app-intro-slider'
import { Colors } from 'react-native/Libraries/NewAppScreen'

const slides = [
  {
    key: 1,
    title: 'Title 1',
    text: 'Description.\nSay something cool',
    image: require('../assets/1.png'),
    backgroundColor: '#59b2ab',
  },
  {
    key: 2,
    title: 'Title 2',
    text: 'Other cool stuff',
    image: require('../assets/2.png'),
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
const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    margin: 20,
  },
})
const Onboarding: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.slide}>
        <Text style={styles.title}>{item.title}</Text>
        <Image source={item.image} />
        <Text style={styles.text}>{item.text}</Text>
      </View>
      <AppIntroSlider data={slides} />
    </SafeAreaView>
  )
}
export default Onboarding
