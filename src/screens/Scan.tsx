import { StackNavigationProp } from '@react-navigation/stack'
import React, { useState } from 'react'
import { useAgent } from '@aries-framework/react-hooks'
import { parseUrl } from 'query-string'
import { Agent } from '@aries-framework/core'
import type { BarCodeReadEvent } from 'react-native-camera'
import { StyleSheet, View } from 'react-native'
import { useIsFocused } from '@react-navigation/core'
import { Buffer } from 'buffer'
import QRScanner from '../components/inputs/QRScanner'
import { ScanStackParams, Screens, TabStacks } from '../types/navigators'
import QrCodeScanError from '../types/error'
import { ColorPallet } from '../theme/theme'

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
  const isFocused = useIsFocused()

  const [qrCodeScanError, setQrCodeScanError] =
    useState<QrCodeScanError | null>(null)

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
    await agent?.receiveMessage(message)
    navigation.navigate(TabStacks.HomeStack)
  }

  const handleCodeScan = async (event: BarCodeReadEvent) => {
    setQrCodeScanError(null)
    try {
      const url = event.data
      if (isRedirecton(url)) {
        await handleRedirection(url, agent)
      } else if (url.includes('?c_i') || url.includes('?d_m')) {
        const [, urlData] = url.includes('?c_i')
          ? url.split('?c_i=')
          : url.split('?d_m=')
        const message = JSON.parse(
          Buffer.from(urlData.trim(), 'base64').toString(),
        )
        if (message['~service']) {
          await agent?.receiveMessage(message)
          navigation.navigate(TabStacks.HomeStack)
        } else {
          navigation.navigate(Screens.ConnectionInvitation, { url })
        }
      } else {
        throw new Error('Not a valid URL')
      }
    } catch (e: unknown) {
      console.log('error', e)
      const error = new QrCodeScanError('Invalid QrCode', event.data)
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
