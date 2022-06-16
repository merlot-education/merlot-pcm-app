import type { StackScreenProps } from '@react-navigation/stack'

import {
  ProofRecord,
  ProofState,
  RequestedAttribute,
  RetrievedCredentials,
} from '@aries-framework/core'
import {
  useAgent,
  useProofById,
  useConnectionById,
} from '@aries-framework/react-hooks'
import React, { useState, useEffect } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { Alert, View, StyleSheet, Text } from 'react-native'
import { Buffer } from 'buffer'
import { ItemType } from 'react-native-dropdown-picker'
import { uuid } from '@aries-framework/core/build/utils/uuid'
import ProofDeclined from '../../assets/img/proof-declined.svg'
import ProofPending from '../../assets/img/proof-pending.svg'
import ProofSuccess from '../../assets/img/proof-success.svg'
import { ColorPallet, TextTheme } from '../../theme/theme'
import { HomeStackParams, Screens, Stacks } from '../../types/navigators'
import { Attribute } from '../../types/record'
import { getCredDefName, getSchemaNameFromSchemaId } from '../../utils/helpers'
import ProofRequestAttribute from '../../components/views/ProofRequestAttribute'
import Button, { ButtonType } from '../../components/button/Button'
import FlowDetailModal from '../../components/modals/FlowDetailModal'
import InfoTextBox from '../../components/text/InfoTextBox'
import { errorToast } from '../../utils/toast'
import { getRetrievedCredential } from './ProofRequest.utils'

type ProofRequestProps = StackScreenProps<HomeStackParams, Screens.ProofRequest>

interface ProofRequestAttribute extends Attribute {
  values?: RequestedAttribute[]
}

interface CredentialList {
  isSelected: boolean
  label: string
  value: string
}

export interface CredentialDisplay {
  key: string
  names: string[]
  values: string[]
  credentials: CredentialList[]
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  headerTextContainer: {
    paddingHorizontal: 25,
    paddingVertical: 16,
  },
  headerText: {
    ...TextTheme.normal,
    flexShrink: 1,
  },
  footerButton: {
    paddingTop: 10,
  },
  link: {
    ...TextTheme.normal,
    minHeight: TextTheme.normal.fontSize,
    color: ColorPallet.brand.link,
    paddingVertical: 2,
  },
  valueContainer: {
    minHeight: TextTheme.normal.fontSize,
    paddingVertical: 4,
  },
})

const ProofRequest: React.FC<ProofRequestProps> = ({ navigation, route }) => {
  if (!route?.params) {
    throw new Error('ProofRequest route prams were not set properly')
  }

  const { proofId } = route.params
  const { agent } = useAgent()
  const { t } = useTranslation()
  const [buttonsVisible, setButtonsVisible] = useState(true)
  const [pendingModalVisible, setPendingModalVisible] = useState(false)
  const [successModalVisible, setSuccessModalVisible] = useState(false)
  const [declinedModalVisible, setDeclinedModalVisible] = useState(false)

  const [attributeCredentials, setAttributeCredentials] = useState<
    [string, RequestedAttribute[]][]
  >([])

  const [retrievedCredentials, setRetrievedCredentials] =
    useState<RetrievedCredentials>()
  const [isShowError, setIsShowError] = useState(false)
  const [missingAttributes, setMissingAttributes] = useState<string[]>([])
  const [credentialsDisplay, setCredentialsDisplay] = useState<
    CredentialDisplay[]
  >([])
  const proof = useProofById(proofId)
  const connection = useConnectionById(
    proof?.connectionId ? proof.connectionId : '',
  )

  const transformProofObject = async (creds: RetrievedCredentials) => {
    const base64Data =
      proof?.requestMessage?.requestPresentationAttachments[0].data.base64
    const proofRequest = JSON.parse(
      Buffer.from(base64Data!, 'base64').toString(),
    )
    const requestedAttributesKeys = Object.keys(
      proofRequest.requested_attributes,
    )
    const requestedPredicatesKeys = Object.keys(
      proofRequest.requested_predicates,
    )
    const displayObject: CredentialDisplay[] = []

    requestedAttributesKeys.forEach(key => {
      const names = proofRequest.requested_attributes[key].name
        ? [proofRequest.requested_attributes[key].name]
        : proofRequest.requested_attributes[key].names

      if (creds.requestedAttributes[key].length > 0) {
        const credentialList: CredentialList[] = []
        creds.requestedAttributes[key].forEach((cred, index) => {
          const credentialDefinitionId = getCredDefName(
            JSON.parse(JSON.stringify(cred.credentialInfo)).cred_def_id,
          )
          credentialList.push({
            isSelected: index === 0,
            label: credentialDefinitionId,
            value: JSON.parse(JSON.stringify(cred.credentialInfo)).referent,
          })
        })
        const showNames: string[] = []
        const showValues: string[] = []
        names.forEach((name: string) => {
          showNames.push(name)
          showValues.push(
            JSON.parse(
              JSON.stringify(creds.requestedAttributes[key][0].credentialInfo),
            ).attrs[name],
          )
        })
        const object = {
          key,
          names: showNames,
          values: showValues,
          credentials: credentialList,
        }
        displayObject.push(object)
      } else {
        // TODO: handle not matching with proof request
        proofRequest.requested_attributes[key].restrictions.forEach(
          restriction => {
            if (
              Object.prototype.hasOwnProperty.call(restriction, 'schema_name')
            ) {
              names.forEach((name: string) => {
                setMissingAttributes(prevState => [
                  ...prevState,
                  `${name} ${t('Global.from')}  ${restriction.schema_name}`,
                ])
              })
            } else if (
              Object.prototype.hasOwnProperty.call(restriction, 'schema_id')
            ) {
              const schemaName = getSchemaNameFromSchemaId(
                restriction.schema_id,
              )
              names.forEach((name: string) => {
                setMissingAttributes(prevState => [
                  ...prevState,
                  `${name} ${t('Global.from')}  ${schemaName}`,
                ])
              })
            } else {
              names.forEach((name: string) => {
                setMissingAttributes(prevState => [...prevState, name])
              })
            }
          },
        )
        setIsShowError(true)
      }
    })

    requestedPredicatesKeys.forEach(key => {
      const names = proofRequest.requested_predicates[key].name
        ? [proofRequest.requested_predicates[key].name]
        : proofRequest.requested_predicates[key].names

      if (creds.requestedPredicates[key].length > 0) {
        const credentialList: CredentialList[] = []

        creds.requestedPredicates[key].forEach((cred, index) => {
          const credentialDefinitionId = getCredDefName(
            JSON.parse(JSON.stringify(cred.credentialInfo)).cred_def_id,
          )
          credentialList.push({
            isSelected: index === 0,
            label: credentialDefinitionId,
            value: JSON.parse(JSON.stringify(cred.credentialInfo)).referent,
          })
        })

        const showNames: string[] = []
        const showValues: string[] = []

        names.forEach((name: string) => {
          showNames.push(
            `${`${name} ${proofRequest.requested_predicates[key].p_type}`} ${
              proofRequest.requested_predicates[key].p_value
            }`,
          )
          showValues.push(
            JSON.parse(
              JSON.stringify(creds.requestedPredicates[key][0].credentialInfo),
            ).attrs[name],
          )
        })

        const object = {
          key,
          names: showNames,
          values: showValues,
          credentials: credentialList,
        }
        displayObject.push(object)
      } else {
        proofRequest.requested_predicates[key].restrictions.forEach(
          restriction => {
            if (
              Object.prototype.hasOwnProperty.call(restriction, 'schema_name')
            ) {
              names.forEach((name: string) => {
                setMissingAttributes(prevState => [
                  ...prevState,
                  `${`${name + proofRequest.requested_predicates[key].p_type} ${
                    proofRequest.requested_predicates[key].p_value
                  }`} ${t('Global.from')}  ${restriction.schema_name}`,
                ])
              })
            } else if (
              Object.prototype.hasOwnProperty.call(restriction, 'schema_id')
            ) {
              const schemaName = getSchemaNameFromSchemaId(
                restriction.schema_id,
              )
              names.forEach((name: string) => {
                setMissingAttributes(prevState => [
                  ...prevState,
                  `${`${name + proofRequest.requested_predicates[key].p_type} ${
                    proofRequest.requested_predicates[key].p_value
                  }`} ${t('Global.from')} ${schemaName}`,
                ])
              })
            } else {
              names.forEach((name: string) => {
                setMissingAttributes(prevState => [
                  ...prevState,
                  `${name + proofRequest.requested_predicates[key].p_type} ${
                    proofRequest.requested_predicates[key].p_value
                  }`,
                ])
              })
            }
          },
        )
        setIsShowError(true)
      }
    })
    setCredentialsDisplay(displayObject)
  }

  if (!agent) {
    throw new Error('Unable to fetch agent from AFJ')
  }

  if (!proof) {
    throw new Error('Unable to fetch proof from AFJ')
  }

  useEffect(() => {
    const updateRetrievedCredentials = async (proof: ProofRecord) => {
      const creds = await getRetrievedCredential(agent, proof)
      if (!creds) {
        throw new Error(t('ProofRequest.RequestedCredentialsCouldNotBeFound'))
      }
      transformProofObject(creds)
      setRetrievedCredentials(creds)
    }

    updateRetrievedCredentials(proof).catch(() => {
      errorToast(
        t('ProofRequest.ProofUpdateErrorTitle'),
        t('ProofRequest.ProofUpdateErrorMessage'),
      )
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [agent.proofs, proof, t])

  useEffect(() => {
    if (proof.state === ProofState.Done) {
      if (pendingModalVisible) {
        setPendingModalVisible(false)
      }
      setSuccessModalVisible(true)
    }
  }, [pendingModalVisible, proof])

  useEffect(() => {
    if (proof.state === ProofState.Declined) {
      setDeclinedModalVisible(true)
    }
  }, [proof])

  const anyUnavailable = (
    attributes: [string, RequestedAttribute[]][] = [],
  ): boolean => attributes.some(([, values]) => !values?.length)

  const anyRevoked = (
    attributes: [string, RequestedAttribute[]][] = [],
  ): boolean =>
    attributes.some(([, values]) => values?.every(value => value.revoked))

  const handleAcceptPress = async () => {
    try {
      setButtonsVisible(false)
      setPendingModalVisible(true)
      const updateRetrievedCredentials: RetrievedCredentials = {
        requestedAttributes: {},
        requestedPredicates: {},
      }

      credentialsDisplay?.map(async (credential: CredentialDisplay) => {
        const isSelectedCredentialId = credential.credentials.find(
          credential => credential.isSelected,
        )?.value
        if (
          Object.prototype.hasOwnProperty.call(
            retrievedCredentials?.requestedAttributes,
            credential.key,
          )
        ) {
          const selectedCredential = retrievedCredentials?.requestedAttributes[
            credential.key
          ].filter(item => item.credentialId === isSelectedCredentialId)
          const object = {
            [credential.key]: selectedCredential,
          }
          Object.assign(updateRetrievedCredentials.requestedAttributes, object)
        }

        if (
          Object.prototype.hasOwnProperty.call(
            retrievedCredentials?.requestedPredicates,
            credential.key,
          )
        ) {
          const selectedCredential = retrievedCredentials?.requestedPredicates[
            credential.key
          ].filter(item => item.credentialId === isSelectedCredentialId)
          const object = {
            [credential.key]: selectedCredential,
          }
          Object.assign(updateRetrievedCredentials.requestedPredicates, object)
        }
      })
      const automaticRequestedCreds =
        retrievedCredentials &&
        agent.proofs.autoSelectCredentialsForProofRequest(
          updateRetrievedCredentials,
        )
      if (!automaticRequestedCreds) {
        throw new Error(t('ProofRequest.RequestedCredentialsCouldNotBeFound'))
      }
      await agent.proofs.acceptRequest(proof.id, automaticRequestedCreds)

      // eslint-disable-next-line no-restricted-syntax
      for await (const iterator of credentialsDisplay) {
        const cred = iterator.credentials.find(item => item.isSelected)
        const attributes = {}
        iterator.names.forEach((name, index) => {
          attributes[name] = iterator.values[index]
        })
        const record = {
          status: 'presented',
          timestamp: new Date().getTime(),
          connectionLabel: connection?.theirLabel ?? 'Connection less proof',
          attributes,
        }

        // Get old record if exists
        const oldRecords = await agent.genericRecords.findAllByQuery({
          credentialRecordId: cred.value,
        })

        // If old record exists, update it
        oldRecords[0].content = {
          records: [...oldRecords[0].content.records, record],
        }

        // Update record
        await agent.genericRecords.update(oldRecords[0])
      }

      // eslint-disable-next-line no-restricted-syntax
      for await (const iterator of credentialsDisplay) {
        const cred = iterator.credentials.find(item => item.isSelected)
        const tags = {
          connectionId: connection?.id ?? uuid(),
          credentialRecordId: cred.value,
          type: 'proof',
        }
        const attributes = {}
        iterator.names.forEach((name, index) => {
          attributes[name] = iterator.values[index]
        })

        // Create record object for proof
        const record = {
          status: 'presented',
          timestamp: new Date().getTime(),
          connectionLabel: connection?.theirLabel ?? 'Connection less proof',
          credentialLabel: cred.label,
          attributes,
        }

        // Get old record if exists
        const oldRecords = await agent.genericRecords.findAllByQuery({
          credentialRecordId: cred.value,
          type: 'proof',
        })

        // Create record if not exists
        if (oldRecords.length > 0) {
          oldRecords[0].content = {
            records: [...oldRecords[0].content.records, record],
          }
          await agent.genericRecords.update(oldRecords[0])
        } else {
          await agent.genericRecords.save({
            tags,
            content: { records: [record] },
          })
        }
      }

      setPendingModalVisible(false)
      setSuccessModalVisible(true)
    } catch (e: unknown) {
      setButtonsVisible(true)
      setPendingModalVisible(false)
      errorToast(
        t('ProofRequest.ProofAcceptErrorTitle'),
        t('ProofRequest.ProofAcceptErrorMessage'),
      )
    }
  }

  const handleDeclinePress = async () => {
    Alert.alert(
      t('ProofRequest.RejectThisProof?'),
      t('Global.ThisDecisionCannotBeChanged.'),
      [
        { text: t('Global.Cancel'), style: 'cancel' },
        {
          text: t('Global.Confirm'),
          style: 'destructive',
          onPress: async () => {
            try {
              setButtonsVisible(false)
              await agent.proofs.declineRequest(proof.id)
            } catch (e: unknown) {
              errorToast(
                t('ProofRequest.ProofRejectErrorTitle'),
                t('ProofRequest.ProofRejectErrorMessage'),
              )
            }
          },
        },
      ],
    )
  }

  const onCredentialSelect = async (credentialId: string, key: string) => {
    const updatedCredentialsDisplay = [...credentialsDisplay]
    const credential = updatedCredentialsDisplay.filter(
      (object: { key: string }) => object.key === key,
    )[0]
    if (retrievedCredentials?.requestedAttributes?.[key]) {
      const keyObject = retrievedCredentials?.requestedAttributes?.[key].filter(
        object => object.credentialId === credentialId,
      )[0]
      const showValues: string[] = []
      credential?.names.forEach((name: string) => {
        showValues.push(
          JSON.parse(JSON.stringify(keyObject.credentialInfo)).attrs[name],
        )
      })
      credential.credentials.forEach((item: any) => {
        const element = item
        if (item.value === credentialId) {
          element.isSelected = true
        } else {
          element.isSelected = false
        }
      })
      credential.values = showValues
    }
    const index = updatedCredentialsDisplay.findIndex(
      (item: string) => item === key,
    )
    updatedCredentialsDisplay[index] = credential
    setCredentialsDisplay(updatedCredentialsDisplay)
  }

  return (
    <View style={styles.container}>
      {isShowError ? (
        <>
          <Text
            style={[
              TextTheme.headingFour,
              {
                color: ColorPallet.notification.errorText,
                marginVertical: 10,
              },
            ]}
          >
            {t('ProofRequest.MissingInformation.Title')}
          </Text>
          <InfoTextBox>
            {t('ProofRequest.MissingInformation.AlertMissingInformation.Title')}
          </InfoTextBox>
          <View>
            {missingAttributes.map(item => (
              <Text key={item} style={TextTheme.normal}>
                {item}
              </Text>
            ))}
          </View>
        </>
      ) : null}

      {!isShowError && (
        <>
          <Text
            style={TextTheme.normal}
            accessibilityLabel={t('ProofRequest.Title', {
              connection: connection?.theirLabel ?? 'Verifier',
            })}
          >
            <Trans
              i18nKey="ProofRequest.Title"
              values={{
                connection: connection?.theirLabel ?? 'Verifier',
              }}
              components={{
                b: <Text style={{ fontWeight: 'bold' }} />,
              }}
              t={t}
            />
          </Text>

          <View style={{ zIndex: 1 }}>
            <ProofRequestAttribute
              proofRequest={credentialsDisplay}
              onSelectItem={(item: ItemType, key) =>
                onCredentialSelect(item.value, key)
              }
            />
          </View>
        </>
      )}

      <View style={{ marginBottom: 30 }}>
        {!(
          anyUnavailable(attributeCredentials) ||
          anyRevoked(attributeCredentials)
        ) && !isShowError ? (
          <View style={styles.footerButton}>
            <Button
              title={t('Global.Share')}
              buttonType={ButtonType.Primary}
              onPress={handleAcceptPress}
              disabled={!buttonsVisible}
            />
          </View>
        ) : null}
        <View style={styles.footerButton}>
          <Button
            title={t('Global.Decline')}
            buttonType={
              anyUnavailable(attributeCredentials) ||
              anyRevoked(attributeCredentials)
                ? ButtonType.Primary
                : ButtonType.Ghost
            }
            onPress={handleDeclinePress}
            disabled={!buttonsVisible}
          />
        </View>
      </View>
      {pendingModalVisible && (
        <FlowDetailModal
          title={t('ProofRequest.SendingTheInformationSecurely')}
          visible={pendingModalVisible}
          doneHidden
        >
          <ProofPending style={{ marginVertical: 20 }} />
        </FlowDetailModal>
      )}

      {successModalVisible && (
        <FlowDetailModal
          title={t('ProofRequest.InformationSentSuccessfully')}
          visible={successModalVisible}
          onDone={() => {
            setSuccessModalVisible(false)
            navigation.pop()
            navigation
              .getParent()
              ?.navigate(Stacks.TabStack, { screen: Screens.Home })
          }}
        >
          <ProofSuccess style={{ marginVertical: 20 }} />
        </FlowDetailModal>
      )}
      {declinedModalVisible && (
        <FlowDetailModal
          title={t('ProofRequest.ProofRejected')}
          visible={declinedModalVisible}
          onDone={() => {
            setDeclinedModalVisible(false)
            navigation.pop()
            navigation
              .getParent()
              ?.navigate(Stacks.TabStack, { screen: Screens.Home })
          }}
        >
          <ProofDeclined style={{ marginVertical: 20 }} />
        </FlowDetailModal>
      )}
    </View>
  )
}

export default ProofRequest
