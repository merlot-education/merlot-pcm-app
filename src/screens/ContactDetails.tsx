import { useConnectionById } from '@aries-framework/react-hooks'
import { StackScreenProps } from '@react-navigation/stack'
import React, { useEffect } from 'react'

import { SafeAreaScrollView, Label } from '../components'
import { ContactStackParams, Screens } from '../types/navigators'
import { dateFormatOptions } from '../constants'

type ContactDetailsProps = StackScreenProps<
  ContactStackParams,
  Screens.ContactDetails
>

const ContactDetails: React.FC<ContactDetailsProps> = ({
  navigation,
  route,
}) => {
  const connection = useConnectionById(route?.params?.connectionId)
  useEffect(() => {
    navigation.setOptions({
      title: connection?.alias,
    })
  }, [connection?.alias, navigation])

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
    </SafeAreaScrollView>
  )
}

export default ContactDetails
