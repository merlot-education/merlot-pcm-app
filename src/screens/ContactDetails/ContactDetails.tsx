import { useAgent, useConnectionById } from '@aries-framework/react-hooks'
import { StackScreenProps } from '@react-navigation/stack'
import React, { useCallback, useEffect, useState } from 'react'

import {
  TouchableOpacity,
  StyleSheet,
  Text,
  Alert,
  View,
  FlatList,
} from 'react-native'
import { useTranslation } from 'react-i18next'
import { Label } from '../../components'
import { ContactStackParams, Screens } from '../../types/navigators'
import { dateFormatOptions } from '../../constants'
import { ColorPallet, TextTheme } from '../../theme/theme'
import { errorToast, successToast } from '../../utils/toast'
import Accordion from '../../components/accordion/Accordion'

type ContactDetailsProps = StackScreenProps<
  ContactStackParams,
  Screens.ContactDetails
>

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  footerText: {
    ...TextTheme.normal,
    padding: 10,
  },
  link: {
    ...TextTheme.normal,
    color: ColorPallet.brand.link,
  },
  cardContainer: {
    padding: 10,
    paddingBottom: 35,
  },
  divider: {
    borderBottomColor: ColorPallet.baseColors.lightGrey,
    borderBottomWidth: 1,
    width: '100%',
  },
  attribute: {
    width: '50%',
  },
  attributeContainer: {
    flexDirection: 'row',
    marginVertical: 5,
  },
})

const ContactDetails: React.FC<ContactDetailsProps> = ({
  navigation,
  route,
}) => {
  const { t } = useTranslation()
  const { agent } = useAgent()
  const connection = useConnectionById(route?.params?.connectionId)
  const [history, setHistory] = useState([])
  useEffect(() => {
    navigation.setOptions({
      title: connection?.alias ?? connection?.theirLabel,
    })
  }, [connection, navigation])

  const getConnectionHistory = useCallback(async () => {
    // Get credential records for a specific connection
    const credentialData = await agent.genericRecords.findAllByQuery({
      connectionId: connection.id,
      type: 'credential',
    })

    // Get proof records for a specific connection
    const proofData = await agent.genericRecords.findAllByQuery({
      connectionId: connection.id,
      type: 'proof',
    })

    // Set empty array if no data is returned
    const credentialRecords =
      credentialData.length > 0 ? credentialData[0].content.records : []

    // Set empty array if no data is returned
    const proofRecords =
      proofData.length > 0 ? proofData[0].content.records : []

    // Combine credential and proof records into one array and filter with connection label
    const history = [...credentialRecords, ...proofRecords].filter(
      record => record.connectionLabel === connection.theirLabel,
    )

    // Sort history by timestamp
    const sortedHistory = history.sort(
      (x, y) =>
        new Date(y.timestamp).valueOf() - new Date(x.timestamp).valueOf(),
    )

    setHistory(sortedHistory)
  }, [agent.genericRecords, connection])

  useEffect(() => {
    getConnectionHistory()
  }, [getConnectionHistory])

  const showDeleteConnectionAlert = () => {
    Alert.alert(
      t('ContactDetails.DeleteConnection'),
      t('ContactDetails.DeleteConnectionAlert'),
      [
        {
          text: t('Global.Cancel'),
          style: 'cancel',
        },
        { text: t('Global.Okay'), onPress: deleteConnection },
      ],
    )
  }

  const deleteConnection = async () => {
    try {
      // Get the mediator connection from the connections list
      if (connection.theirLabel.toUpperCase().includes('MEDIATOR')) {
        errorToast(t('ContactDetails.ConnectionCannotDelete'))
        return
      }

      // Delete the connection by id
      await agent.connections.deleteById(connection.id)

      successToast(t('ContactDetails.DeleteConnectionSuccess'))
      navigation.navigate(Screens.ListContacts)
    } catch (error) {
      errorToast(t('ContactDetails.DeleteConnectionFailed'))
    }
  }

  return (
    <View style={styles.container}>
      <Label title="Name" subtitle={connection?.theirLabel} />
      <Label title="Id" subtitle={connection?.id} />
      <Label title="Did" subtitle={connection?.did} />
      <Label
        title="Created"
        subtitle={connection.createdAt.toLocaleDateString(
          'en-CA',
          dateFormatOptions,
        )}
      />
      <Label title="Connection State" subtitle={connection?.state} />
      <TouchableOpacity
        testID="delete-contact"
        onPress={showDeleteConnectionAlert}
      >
        <Text
          style={[
            styles.footerText,
            styles.link,
            { color: ColorPallet.semantic.error },
          ]}
        >
          {t('ContactDetails.DeleteConnection')}
        </Text>
      </TouchableOpacity>

      <FlatList
        data={history}
        contentContainerStyle={styles.cardContainer}
        renderItem={({ item }) => (
          <View key={item.timestamp.toString()}>
            <Accordion
              title={item.connectionLabel}
              date={new Date(item.timestamp)}
              status={item.status}
              innerAccordion
              key={item.timestamp.toString()}
            >
              {Object.entries(item.attributes).map(([key, value]) => {
                return (
                  <View style={styles.attributeContainer}>
                    <Text style={styles.attribute}>{key}</Text>
                    <Text style={styles.attribute}>{value.toString()}</Text>
                  </View>
                )
              })}
            </Accordion>
            <View style={styles.divider} />
          </View>
        )}
        keyExtractor={item => item.timestamp.toString()}
      />
    </View>
  )
}

export default ContactDetails
