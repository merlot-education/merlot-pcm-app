import { StackScreenProps } from '@react-navigation/stack'
import { ConnectionRecord, CredentialState } from '@aries-framework/core'
import { StyleSheet, Alert, View, Text, Button } from 'react-native'
import {
  useAgent,
  useConnectionById,
  useCredentialById,
} from '@aries-framework/react-hooks'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ColorPallet, TextTheme } from '../theme/theme'
import { HomeStackParams, Screens, TabStacks } from '../types/navigators'
import Title from '../components/text/Title'
import FlowDetailModal from '../components/modals/FlowDetailModal'
import Record from '../components/record/Record'
import CredentialCard from '../components/misc/CredentialCard'
import CredentialDeclined from '../assets/img/credential-declined.svg'
import CredentialPending from '../assets/img/credential-pending.svg'
import CredentialSuccess from '../assets/img/credential-success.svg'

type CredentialOfferProps = StackScreenProps<
  HomeStackParams,
  Screens.CredentialOffer
>
const styles = StyleSheet.create({
  headerTextContainer: {
    paddingHorizontal: 25,
    paddingVertical: 16,
    backgroundColor: ColorPallet.grayscale.white,
  },
  headerText: {
    backgroundColor: ColorPallet.grayscale.white,
    ...TextTheme.normal,
    flexShrink: 1,
  },
  footerButton: {
    paddingTop: 10,
    backgroundColor: ColorPallet.grayscale.white,
  },
})

const CredentialOffer: React.FC<CredentialOfferProps> = ({
  navigation,
  route,
}) => {
  if (!route?.params) {
    throw new Error('CredentialOffer route prams were not set properly')
  }
  const { credentialId } = route.params
  const { agent } = useAgent()
  const { t } = useTranslation()
  const [buttonsVisible, setButtonsVisible] = useState(true)
  const [pendingModalVisible, setPendingModalVisible] = useState(false)
  const [successModalVisible, setSuccessModalVisible] = useState(false)
  const [declinedModalVisible, setDeclinedModalVisible] = useState(false)

  const credential = useCredentialById(credentialId)

  if (!agent) {
    throw new Error('Unable to fetch agent from AFJ')
  }

  if (!credential) {
    throw new Error('Unable to fetch credential from AFJ')
  }

  useEffect(() => {
    if (credential.state === CredentialState.Declined) {
      setDeclinedModalVisible(true)
    }
  }, [credential])

  useEffect(() => {
    if (
      credential.state === CredentialState.CredentialReceived ||
      credential.state === CredentialState.Done
    ) {
      if (pendingModalVisible) {
        setPendingModalVisible(false)
      }
      setSuccessModalVisible(true)
    }
  }, [credential, pendingModalVisible])

  const handleAcceptPress = async () => {
    try {
      setButtonsVisible(false)
      setPendingModalVisible(true)
      await agent.credentials.acceptOffer(credential.id)
    } catch (e: unknown) {
      setButtonsVisible(true)
      setPendingModalVisible(false)
      console.log(
        'Unable to accept offer There was a problem while accepting the credential offer.',
      )
    }
  }

  const handleDeclinePress = async () => {
    Alert.alert(
      t('CredentialOffer.RejectThisCredential?'),
      t('Global.ThisDecisionCannotBeChanged.'),
      [
        { text: t('Global.Cancel'), style: 'cancel' },
        {
          text: t('Global.Confirm'),
          style: 'destructive',
          onPress: async () => {
            try {
              setButtonsVisible(false)
              await agent.credentials.declineOffer(credential.id)
            } catch (e: unknown) {
              console.log(
                'Unable to reject offer',
                'There was a problem while rejecting the credential offer.',
              )
            }
          },
        },
      ],
    )
  }

  const connection = useConnectionById(credential.connectionId)

  const getConnectionName = (connection: ConnectionRecord) => {
    return connection?.alias || connection?.invitation?.label
  }

  return (
    <>
      <Record
        header={() => (
          <>
            <View style={styles.headerTextContainer}>
              <Text style={styles.headerText}>
                <Title>
                  {getConnectionName(connection) ||
                    t('ContactDetails.AContact')}
                </Title>{' '}
                {t('CredentialOffer.IsOfferingYouACredential')}
              </Text>
            </View>
            <CredentialCard
              credential={credential}
              style={{ marginHorizontal: 15, marginBottom: 16 }}
            />
          </>
        )}
        footer={() => (
          <View style={{ marginBottom: 30 }}>
            <View style={styles.footerButton}>
              <Button
                title={t('Global.Accept')}
                onPress={handleAcceptPress}
                disabled={!buttonsVisible}
              />
            </View>
            <View style={styles.footerButton}>
              <Button
                title={t('Global.Decline')}
                onPress={handleDeclinePress}
                disabled={!buttonsVisible}
              />
            </View>
          </View>
        )}
        attributes={credential.credentialAttributes}
      />
      <FlowDetailModal
        title={t('CredentialOffer.CredentialOnTheWay')}
        doneTitle={t('Global.Cancel')}
        visible={pendingModalVisible}
        onDone={() => {
          setPendingModalVisible(false)
        }}
      >
        <CredentialPending style={{ marginVertical: 20 }} />
      </FlowDetailModal>
      <FlowDetailModal
        title={t('CredentialOffer.CredentialAddedToYourWallet')}
        visible={successModalVisible}
        onDone={() => {
          setSuccessModalVisible(false)
          navigation.pop()
          navigation.getParent()?.navigate(TabStacks.CredentialStack, {
            screen: Screens.Credentials,
          })
        }}
      >
        <CredentialSuccess style={{ marginVertical: 20 }} />
      </FlowDetailModal>
      <FlowDetailModal
        title={t('CredentialOffer.CredentialDeclined')}
        visible={declinedModalVisible}
        onDone={() => {
          setDeclinedModalVisible(false)
          navigation.pop()
          navigation.navigate(Screens.Home)
        }}
      >
        <CredentialDeclined style={{ marginVertical: 20 }} />
      </FlowDetailModal>
    </>
  )
}

export default CredentialOffer
