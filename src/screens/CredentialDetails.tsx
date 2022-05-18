import type { StackScreenProps } from '@react-navigation/stack'

import { useCredentialById } from '@aries-framework/react-hooks'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'
import Toast from 'react-native-toast-message'
import Record from '../components/record/Record'
import { ToastType } from '../components/toast/BaseToast'
import CredentialCard from '../components/misc/CredentialCard'
import { CredentialStackParams, Screens } from '../types/navigators'

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
    Toast.show({
      type: ToastType.Error,
      text1: t('Global.Failure'),
      text2: t('CredentialOffer.CredentialNotFound'),
    })

    navigation.goBack()
    return null
  }
  if (!credential) {
    Toast.show({
      type: ToastType.Error,
      text1: t('Global.Failure'),
      text2: t('CredentialOffer.CredentialNotFound'),
    })

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
