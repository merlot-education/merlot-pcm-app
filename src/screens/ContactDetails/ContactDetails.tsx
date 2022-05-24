import { useAgent, useConnectionById } from '@aries-framework/react-hooks'
import { StackScreenProps } from '@react-navigation/stack'
import React, { useEffect } from 'react'

import { TouchableOpacity, StyleSheet, Text, Alert } from 'react-native'
import { useTranslation } from 'react-i18next'
import { SafeAreaScrollView, Label } from '../../components'
import { ContactStackParams, Screens } from '../../types/navigators'
import { dateFormatOptions } from '../../constants'
import { ColorPallet, TextTheme } from '../../theme/theme'
import { errorToast, successToast } from '../../utils/toast'

type ContactDetailsProps = StackScreenProps<
  ContactStackParams,
  Screens.ContactDetails
>

const styles = StyleSheet.create({
  footerText: {
    ...TextTheme.normal,
    padding: 10,
  },
  link: {
    ...TextTheme.normal,
    color: ColorPallet.brand.link,
  },
})

const ContactDetails: React.FC<ContactDetailsProps> = ({
  navigation,
  route,
}) => {
  const { t } = useTranslation()
  const { agent } = useAgent()
  const connection = useConnectionById(route?.params?.connectionId)
  useEffect(() => {
    navigation.setOptions({
      title: connection?.alias ?? connection?.theirLabel,
    })
  }, [connection, navigation])

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
      if (connection.theirLabel === 'Indicio Public Mediator') {
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
    <SafeAreaScrollView>
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
    </SafeAreaScrollView>
  )
}

export default ContactDetails
