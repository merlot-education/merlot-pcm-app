import React from 'react'
import { SafeAreaView, StyleSheet } from 'react-native'
import { HighlightTextBox, Label, Title } from './src/components'
import { TextTheme } from './src/theme/theme'

const App = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Label title="Title" subtitle="subtitle" label="label" />
      <HighlightTextBox>HighlightTextBox</HighlightTextBox>
      <Title>title</Title>
      <Title style={TextTheme.headingOne}>title</Title>
      <Title style={TextTheme.headingTwo}>title</Title>
      <Title style={TextTheme.headingThree}>title</Title>
      <Title style={TextTheme.headingFour}>title</Title>
      <Title style={TextTheme.caption}>title</Title>
      <Title style={TextTheme.label}>title</Title>
      <Title style={TextTheme.normal}>title</Title>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    // alignItems: 'center',
    // justifyContent: 'center',
    backgroundColor: 'black',
  },
})

export default App
