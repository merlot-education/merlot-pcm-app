import { StackNavigationProp } from '@react-navigation/stack'
import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useAgent, useConnectionById } from '@aries-framework/react-hooks'
import Toast from 'react-native-toast-message'
import { parseUrl } from 'query-string'
import { Agent, ConnectionState } from '@aries-framework/core'
import type { BarCodeReadEvent } from 'react-native-camera'
import { StyleSheet, View } from 'react-native'
import { useIsFocused, useNavigation } from '@react-navigation/core'
import { ToastType } from '../components/toast/BaseToast'
import QRScanner from '../components/inputs/QRScanner'
import { ScanStackParams, Screens, TabStacks } from '../types/navigators'
import QrCodeScanError from '../types/error'
import { ColorPallet } from '../theme/theme'
import PCMError from '../types/pcm_error'

const styles = StyleSheet.create({
  container: {
    backgroundColor: ColorPallet.grayscale.white,
  },
})

interface ScanProps {
  navigation: StackNavigationProp<ScanStackParams, Screens.Scan>
}

const Scan: React.FC<ScanProps> = ({ navigation }) => {
  const { agent } = useAgent()
  const { t } = useTranslation()
  const nav = useNavigation()
  const isFocused = useIsFocused()

  const [qrCodeScanError, setQrCodeScanError] =
    useState<QrCodeScanError | null>(null)
  const [connectionId, setConnectionId] = useState('')
  const connection = useConnectionById(connectionId)

  const isRedirecton = (url: string): boolean => {
    const queryParams = parseUrl(url).query
    console.log(url)
    return !(queryParams.c_i || queryParams.d_m)
  }

  const handleRedirection = async (
    url: string,
    agent?: Agent,
  ): Promise<void> => {
    try {
      const res = await fetch(url, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      })
      const message = await res.json()

      await agent?.receiveMessage(message)
    } catch (err: unknown) {
      const error = new PCMError(
        'Unable to accept connection',
        'There was a problem while accepting the connection redirection',
        1024,
      )

      navigation
        .getParent()
        ?.navigate(TabStacks.HomeStack, { screen: Screens.Home })
    }
  }

  useEffect(() => {
    if (connection?.state === ConnectionState.Complete) {
      Toast.show({
        type: ToastType.Success,
        text1: t('Global.Success'),
        text2: t('Scan.ConnectionAccepted'),
      })
      navigation.navigate(Screens.Home)
    }
  }, [connection, navigation, t])

  const handleCodeScan = async (event: BarCodeReadEvent) => {
    setQrCodeScanError(null)
    try {
      const url = event.data
      if (isRedirecton(url)) {
        await handleRedirection(url, agent)
        console.log('connection url ', url)
      } else {
        nav.navigate(Screens.ConnectionInvitation, { url })
      }
    } catch (e: unknown) {
      const error = new QrCodeScanError(t('Scan.InvalidQrCode'), event.data)
      setQrCodeScanError(error)
    }
  }

  return (
    <View style={[styles.container]}>
      {isFocused && (
        <QRScanner
          handleCodeScan={handleCodeScan}
          error={qrCodeScanError}
          enableCameraOnError
        />
      )}
    </View>
  )
}

export default Scan
