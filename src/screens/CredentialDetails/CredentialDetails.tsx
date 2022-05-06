import type { StackScreenProps } from '@react-navigation/stack'

import { useCredentialById } from '@aries-framework/react-hooks'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'
import Record from '../../components/record/Record'
import CredentialCard from '../../components/misc/CredentialCard'
import { CredentialStackParams, Screens } from '../../types/navigators'
import { warningToast, errorToast } from '../../utils/toast'

type CredentialDetailsProps = StackScreenProps<
  CredentialStackParams,
  Screens.CredentialDetails
>

const CredentialDetails: React.FC<CredentialDetailsProps> = ({
  navigation,
  route,
}) => {
  const { t } = useTranslation()
  const { credentialId } = route.params
  const credential = useCredentialById(credentialId)
  console.log('credentials', credential.metadata)
  if (!route.params.credentialId) {
    warningToast(t('CredentialOffer.CredentialNotFound'))
    navigation.goBack()
    return null
  }
  if (!credential) {
    errorToast(t('CredentialOffer.CredentialNotFound'))
    navigation.goBack()
    return null
  }

  return (
    <Record
      header={() => (
        <CredentialCard
          credential={credential}
          style={{ marginHorizontal: 15, marginTop: 16 }}
        />
      )}
      footer={() => (
        <View style={{ marginBottom: 30 }}>
          {/* <TouchableOpacity activeOpacity={1}>
            <Text
              style={[
                styles.footerText,
                styles.link,
                { color: ColorPallet.semantic.error },
              ]}
            >
              {t('CredentialDetails.RemoveFromWallet')}
            </Text>
          </TouchableOpacity> */}
        </View>
      )}
      attributes={credential.credentialAttributes}
      hideAttributeValues
    />
  )
}

export default CredentialDetails
