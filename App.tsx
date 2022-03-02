/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import SplashScreen from 'react-native-splash-screen'
import {
  Agent,
  MediatorPickupStrategy,
  AutoAcceptCredential,
  ConsoleLogger,
  LogLevel,
  WsOutboundTransport,
  HttpOutboundTransport,
} from '@aries-framework/core'
import { agentDependencies } from '@aries-framework/react-native'
import Config from 'react-native-config'
import md5 from 'md5'
import Mailer from 'react-native-mail'
import { Alert } from 'react-native'
import { Colors } from './src/theme/theme'
import RootStack from './src/navigators/RootStack'
import indyLedgers from './configs/ledgers/indy'

const navigationTheme = {
  dark: false,
  colors: {
    primary: Colors.primary,
    background: Colors.background,
    card: Colors.primary,
    text: 'white',
    border: 'white',
    notification: 'white',
  },
}

const App = () => {
  const [agent, setAgent] = useState<Agent | undefined>(undefined)
  let encodedVal
  const convertMD5 = () => {
    encodedVal = md5('abc@gmail.com')
  }

  const handleEmail = () => {
    Mailer.mail(
      {
        subject: 'need help',
        recipients: ['dhanashree.tambe@ayanworks.com'],
        ccRecipients: ['supportCC@example.com'],
        bccRecipients: ['supportBCC@example.com'],
        body: encodedVal,
        customChooserTitle: 'This is my new title', // Android only (defaults to "Send Mail")
        isHTML: true,
        attachments: [
          {
            // Specify either `path` or `uri` to indicate where to find the file data.
            // The API used to create or locate the file will usually indicate which it returns.
            // An absolute path will look like: /cacheDir/photos/some image.jpg
            // A URI starts with a protocol and looks like: content://appname/cacheDir/photos/some%20image.jpg
            path: '', // The absolute path of the file from which to read data.
            uri: '', // The uri of the file from which to read the data.
            // Specify either `type` or `mimeType` to indicate the type of data.
            type: '', // Mime Type: jpg, png, doc, ppt, html, pdf, csv
            mimeType: '', // - use only if you want to use custom type
            name: '', // Optional: Custom filename for attachment
          },
        ],
      },
      (error, event) => {
        Alert.alert(
          error,
          event,
          [
            {
              text: 'Ok',
              onPress: () => console.log('OK: Email Error Response'),
            },
            {
              text: 'Cancel',
              onPress: () => console.log('CANCEL: Email Error Response'),
            },
          ],
          { cancelable: true },
        )
      },
    )
  }
  const initAgent = async () => {
    convertMD5()
    const newAgent = new Agent(
      {
        label: 'New Wallet',
        mediatorConnectionsInvite: Config.MEDIATOR_URL,
        mediatorPickupStrategy: MediatorPickupStrategy.Implicit,
        walletConfig: { id: 'abc@gmail.com', key: '123' },
        autoAcceptConnections: true,
        publicDidSeed: encodedVal,
        autoAcceptCredentials: AutoAcceptCredential.ContentApproved,
        logger: new ConsoleLogger(LogLevel.trace),
        indyLedgers,
      },
      agentDependencies,
    )

    const wsTransport = new WsOutboundTransport()
    const httpTransport = new HttpOutboundTransport()

    newAgent.registerOutboundTransport(wsTransport)
    newAgent.registerOutboundTransport(httpTransport)

    await newAgent.initialize()
    setAgent(newAgent)
  }
  useEffect(() => {
    // Hide the native splash / loading screen so that our
    // RN version can be displayed.
    SplashScreen.hide()
    initAgent()
    handleEmail()
  }, [])

  return (
    <NavigationContainer theme={navigationTheme}>
      <RootStack />
    </NavigationContainer>
  )
}

export default App
