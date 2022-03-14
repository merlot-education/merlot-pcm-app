import { StackNavigationProp } from '@react-navigation/stack'
import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useAgent, useConnectionById } from '@aries-framework/react-hooks'
import Toast from 'react-native-toast-message'
import { parseUrl } from 'query-string'
import {
  Agent,
  AutoAcceptCredential,
  ConsoleLogger,
  HttpOutboundTransport,
  LogLevel,
  MediatorPickupStrategy,
  WsOutboundTransport,
  AutoAcceptProof,
  ConnectionState,
} from '@aries-framework/core'
import md5 from 'md5'
import Config from 'react-native-config'
import { agentDependencies } from '@aries-framework/react-native'
import type { BarCodeReadEvent } from 'react-native-camera'
import { Alert, StyleSheet, View } from 'react-native'
import { useNavigation } from '@react-navigation/core'
import { t } from 'i18next'
import indyLedgers from '../../configs/ledgers/indy'
import QRScanner from '../components/inputs/QRScanner'
import {
  ConnectionInvitationStackParams,
  HomeStackParams,
  Screens,
} from '../types/navigators'
import QrCodeScanError from '../types/error'
import { Colors, TextTheme } from '../theme/theme'

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    margin: 20,
  },
  bodyText: {
    ...TextTheme.normal,
    flexShrink: 1,
  },
  spacer: {
    height: 40,
  },
})

interface ScanProps {
  navigation: StackNavigationProp<HomeStackParams, 'Home'>
}

const Scan: React.FC<ScanProps> = ({ navigation }) => {
  // const { agent } = useAgent()
  const { t } = useTranslation()
  const [showBox, setShowBox] = useState(true)
  const [agent, setAgent] = useState<Agent | undefined>(undefined)
  const nav = useNavigation()

  const [qrCodeScanError, setQrCodeScanError] =
    useState<QrCodeScanError | null>(null)
  const [connectionId, setConnectionId] = useState('')
  const connection = useConnectionById(connectionId)

  const displayPendingMessage = (): void => {
    Toast.show({
      // type: ToastType.Info,
      text1: t('Global.Info'),
      text2: t('Scan.AcceptingConnection'),
    })
  }

  const showConfirmDialog = (url: string) => {
    return Alert.alert(
      'Connection Invitation?',
      'You have a connection invitation, Do you want to accept?',
      [
        // The "Yes" button
        {
          text: 'Yes',
          onPress: async () => {
            nav.navigate(Screens.ConnectionInvitation, {
              connectionInvitationURL: url,
            })
          },
        },
        // The "No" button
        // Does nothing but dismiss the dialog when tapped
        {
          text: 'No',
        },
      ],
    )
  }
  /*
  const displaySuccessMessage = (): void => {
    Toast.show({
      type: ToastType.Success,
      text1: t('Global.Success'),
      text2: t('Scan.ConnectionAccepted'),
    })
  }
*/
  const isRedirecton = (url: string): boolean => {
    const queryParams = parseUrl(url).query
    console.log(url)
    return !(queryParams.c_i || queryParams.d_m)
  }

  const handleRedirection = async (
    url: string,
    agent?: Agent,
  ): Promise<void> => {
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
    const message = await res.json()
    // TODO: Change to a full screen modal
    // displayPendingMessage()
    await agent?.receiveMessage(message)
  }

  const handleInvitation = async (url: string): Promise<void> => {
    // TODO: Change to a full screen modal
    // displayPendingMessage()
    const connectionRecord = await agent?.connections.receiveInvitationFromUrl(
      url,
      {
        autoAcceptConnection: true,
      },
    )
    if (!connectionRecord?.id) {
      throw new Error(t('Scan.ConnectionNotFound'))
    }
    setConnectionId(connectionRecord.id)
    nav.navigate(Screens.ListContacts)
  }

  useEffect(() => {
    if (connection?.state === ConnectionState.Complete) {
      Toast.show({
        // type: ToastType.Success,
        text1: t('Global.Success'),
        text2: t('Scan.ConnectionAccepted'),
      })
      navigation.navigate('Home')
    }
  }, [connection, navigation, t])

  const handleCodeScan = async (event: BarCodeReadEvent) => {
    setQrCodeScanError(null)
    try {
      const url = event.data
      if (isRedirecton(url)) {
        await handleRedirection(url, agent)
      } else {
        nav.navigate(Screens.ConnectionInvitation, { url })
      }

      // TODO: Change to a full screen modal
      //   displaySuccessMessage()

      // navigation.navigate('Home')
    } catch (e: unknown) {
      const error = new QrCodeScanError(t('Scan.InvalidQrCode'), event.data)
      setQrCodeScanError(error)
    }
  }

  return (
    <View style={[styles.container]}>
      <QRScanner
        handleCodeScan={handleCodeScan}
        error={qrCodeScanError}
        enableCameraOnError
      />
    </View>
  )
}

export default Scan
