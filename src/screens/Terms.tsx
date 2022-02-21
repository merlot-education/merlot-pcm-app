import React, { useState } from 'react'
import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { HighlightTextBox } from '../components'
import Button, { ButtonType } from '../components/button/Button'
import CheckBoxRow from '../components/checkbox/CheckBoxRow'
import InfoTextBox from '../components/text/InfoTextBox'
import { Colors, TextTheme } from '../theme/theme'

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

const Terms: React.FC = () => {
  const [checked, setChecked] = useState(false)

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <InfoTextBox>
          Please agree to the terms and conditions below before using this
          application.
        </InfoTextBox>
        <Text style={[styles.bodyText, styles.verticalSpacer]}>
          <Text style={[styles.bodyText, { fontWeight: 'bold' }]}>
            These are the Terms and Conditions governing the use of this Service
            and the agreement that operates between You and the Company.
          </Text>{' '}
          These Terms and Conditions set out the rights and obligations of all
          users regarding the use of the Service. Your access to and use of the
          Service is conditioned on Your acceptance of and compliance with these
          Terms and Conditions. These Terms and Conditions apply to all
          visitors, users and others who access or use the Service.
        </Text>
        <HighlightTextBox>
          By accessing or using the Service You agree to be bound by these Terms
          and Conditions. If You disagree with any part of these Terms and
          Conditions then You may not access the Service.
        </HighlightTextBox>
        <Text style={[styles.bodyText, styles.topSpacer]}>
          When You create an account with Us, You must provide Us information
          that is accurate, complete, and current at all times.
        </Text>
        <View style={styles.controlsWrapper}>
          <CheckBoxRow
            title="I have read, understand and accept the terms and conditions."
            accessibilityLabel="I Agree"
            checked={checked}
            onPress={() => setChecked(!checked)}
          />
          <View style={styles.topSpacer}>
            <Button
              title="Continue"
              accessibilityLabel="Continue"
              disabled={!checked}
              buttonType={ButtonType.Primary}
            />
          </View>
          <View style={styles.topSpacer}>
            <Button
              title="Back"
              accessibilityLabel="Back"
              buttonType={ButtonType.Secondary}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Terms
