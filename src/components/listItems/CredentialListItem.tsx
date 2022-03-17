import { CredentialRecord } from '@aries-framework/core'
import { useNavigation } from '@react-navigation/core'
import { StackNavigationProp } from '@react-navigation/stack'
import React from 'react'
import { TouchableOpacity } from 'react-native'
import CredentialCard from '../misc/CredentialCard'
import { CredentialStackParams, Screens } from '../../types/navigators'

interface CredentialListItemProps {
  credential: CredentialRecord
}

const CredentialListItem: React.FC<CredentialListItemProps> = ({
  credential,
}) => {
  const navigation = useNavigation<StackNavigationProp<CredentialStackParams>>()

  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate(Screens.CredentialDetails, {
          credentialId: credential.id,
        })
      }
    >
      <CredentialCard credential={credential} />
    </TouchableOpacity>
  )
}

export default CredentialListItem
