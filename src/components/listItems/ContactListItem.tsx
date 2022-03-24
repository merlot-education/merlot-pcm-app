import type { ConnectionRecord } from '@aries-framework/core'

import React from 'react'
import { View, StyleSheet } from 'react-native'
import { borderRadius, ContactTheme } from '../../theme/theme'
import { dateFormatOptions } from '../../constants'
import Text from '../text/Text'
import Title from '../text/Title'

interface Props {
  contact: ConnectionRecord
}

const styles = StyleSheet.create({
  container: {
    marginTop: 15,
    marginHorizontal: 15,
    padding: 10,
    borderRadius,
    backgroundColor: ContactTheme.background,
  },
  date: {
    textAlign: 'right',
  },
})

const ContactListItem: React.FC<Props> = ({ contact }) => {
  return (
    <View key={contact.id} style={styles.container}>
      <Title>{contact?.alias || contact?.invitation?.label}</Title>
      <Text>DID : {contact.did}</Text>
      <Text>State : {contact.state}</Text>
      <Text style={styles.date}>
        {contact.createdAt.toLocaleDateString('en-CA', dateFormatOptions)}
      </Text>
    </View>
  )
}

export default ContactListItem
