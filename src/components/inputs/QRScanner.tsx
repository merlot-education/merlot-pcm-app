import { useNavigation } from '@react-navigation/core'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  useWindowDimensions,
  Vibration,
  View,
  StyleSheet,
  Text,
  Platform,
  TextInput,
  KeyboardAvoidingView,
  TouchableOpacity,
  Dimensions,
  Pressable,
  Keyboard,
} from 'react-native'
import { BarCodeReadEvent, RNCamera } from 'react-native-camera'
import Icon from 'react-native-vector-icons/MaterialIcons'
import AntDesign from 'react-native-vector-icons/AntDesign'
import QRScannerClose from '../misc/QRScannerClose'
import QRScannerTorch from '../misc/QRScannerTorch'
import QrCodeScanError from '../../types/error'
import { ColorPallet } from '../../theme/theme'
import useKeyboard from '../../utils/keyboard'

interface Props {
  handleCodeScan: (event: BarCodeReadEvent) => Promise<void>
  textInputSubmit?: () => void
  error?: QrCodeScanError | null
  enableCameraOnError?: boolean
  url?: string
  onChangeText: (text: string) => void
}
const { width, height } = Dimensions.get('window')

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    backgroundColor: ColorPallet.baseColors.black,
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewFinder: {
    width: 250,
    height: 250,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: ColorPallet.baseColors.white,
    backgroundColor: ColorPallet.baseColors.transparent,
  },
  viewFinderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    color: ColorPallet.baseColors.white,
    padding: 4,
  },
  submitIconStyle: {
    alignSelf: 'center',
  },
  bottomView: {
    flex: 1,
    marginTop: -80,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: ColorPallet.baseColors.white,
    width: '100%',
  },
  textInputStyle: {
    width: width - 100,
    paddingTop: 5,
    color: ColorPallet.baseColors.black,
    alignItems: 'center',
    fontSize: Platform.OS === 'ios' ? height / 50 : height / 45,
    justifyContent: 'center',
    height: Platform.OS === 'ios' ? height / 19 : height / 18,
    borderBottomWidth: 1,
    borderBottomColor: 'black',
    alignSelf: 'center',
    marginVertical: 20,
  },
  rowTextInputView: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
})

const CameraViewContainer: React.FC<{ portrait: boolean }> = ({
  portrait,
  children,
}) => {
  return (
    <View
      style={{
        flexDirection: portrait ? 'column' : 'row',
        alignItems: 'center',
      }}
    >
      {children}
    </View>
  )
}

const QRScanner: React.FC<Props> = ({
  handleCodeScan,
  error,
  enableCameraOnError,
  url,
  onChangeText,
  textInputSubmit,
}) => {
  const navigation = useNavigation()
  const [cameraActive, setCameraActive] = useState(true)
  const [torchActive, setTorchActive] = useState(false)

  const { keyboardHeight, isKeyBoardOpen } = useKeyboard()

  const { width, height } = useWindowDimensions()
  const portraitMode = height > width
  const { t } = useTranslation()
  const invalidQrCodes = new Set<string>()

  return (
    <Pressable
      onPress={() => Keyboard.dismiss()}
      style={styles.container}
      testID="QRScannerTest"
    >
      <RNCamera
        style={styles.container}
        type={RNCamera.Constants.Type.back}
        flashMode={
          torchActive
            ? RNCamera.Constants.FlashMode.torch
            : RNCamera.Constants.FlashMode.off
        }
        captureAudio={false}
        androidCameraPermissionOptions={{
          title: t('QRScanner.PermissionToUseCamera'),
          message: t('QRScanner.WeNeedYourPermissionToUseYourCamera'),
          buttonPositive: t('QRScanner.Ok'),
          buttonNegative: t('Global.Cancel'),
        }}
        barCodeTypes={[RNCamera.Constants.BarCodeType.qr]}
        onBarCodeRead={(event: BarCodeReadEvent) => {
          if (invalidQrCodes.has(event.data)) {
            return
          }
          if (error?.data === event?.data) {
            invalidQrCodes.add(error.data)
            if (enableCameraOnError) {
              setCameraActive(true)
            }
          }
          if (cameraActive) {
            Vibration.vibrate()
            handleCodeScan(event)
            setCameraActive(false)
          }
        }}
      >
        <CameraViewContainer portrait={portraitMode}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              padding: 20,
              width: '100%',
              position: 'absolute',
              top: 10,
            }}
          >
            <QRScannerTorch
              active={torchActive}
              onPress={() => setTorchActive(!torchActive)}
            />
            <QRScannerClose onPress={() => navigation.goBack()} />
          </View>
          {error && (
            <View style={styles.errorContainer}>
              <Icon style={styles.icon} name="cancel" size={30} />
              <Text>{error.message}</Text>
            </View>
          )}
          <View style={styles.viewFinderContainer}>
            <View style={styles.viewFinder} />
          </View>
        </CameraViewContainer>
      </RNCamera>
      <View
        style={[
          styles.bottomView,
          { marginTop: isKeyBoardOpen ? -keyboardHeight - 80 : -80 },
        ]}
      >
        <KeyboardAvoidingView
          behavior="padding"
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
          enabled={Platform.OS === 'ios'}
          style={styles.rowTextInputView}
        >
          <TextInput
            style={styles.textInputStyle}
            placeholder="url"
            value={url}
            onChangeText={onChangeText}
            placeholderTextColor={ColorPallet.baseColors.black}
          />
          <TouchableOpacity
            onPress={textInputSubmit}
            style={styles.submitIconStyle}
          >
            <AntDesign
              name="right"
              color={ColorPallet.baseColors.black}
              size={Platform.OS === 'ios' ? height / 30 : height / 28}
            />
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </View>
    </Pressable>
  )
}

export default QRScanner
