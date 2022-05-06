import { CredentialRecord } from '@aries-framework/core'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, Text, View, ViewStyle } from 'react-native'
import { Title } from '..'

import { dateFormatOptions } from '../../constants'
import { ContactTheme, TextTheme } from '../../theme/theme'
import { parsedSchema } from '../../utils/helpers'
import AvatarView from './AvatarView'

interface CredentialCardProps {
  credential: CredentialRecord
  style?: ViewStyle
  testId?: string
}

const styles = StyleSheet.create({
  container: {
    minHeight: 125,
    backgroundColor: ContactTheme.background,
    justifyContent: 'center',
    borderRadius: 15,
    padding: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  details: { flexShrink: 1 },
})

const CredentialCard: React.FC<CredentialCardProps> = ({
  credential,
  style = {},
  testId,
}) => {
  const { t } = useTranslation()

  return (
    <View style={[styles.container, style]} testID="credentialRecord">
      <View style={styles.row}>
        <AvatarView name={parsedSchema(credential).name} />
        <View style={styles.details}>
          <Title>{parsedSchema(credential).name}</Title>
          <Text style={{ ...TextTheme.caption }}>
            {t('CredentialDetails.Issued')}:{' '}
            {credential.createdAt.toLocaleDateString(
              'en-CA',
              dateFormatOptions,
            )}
          </Text>
        </View>
      </View>
    </View>
  )
}

export default CredentialCard
