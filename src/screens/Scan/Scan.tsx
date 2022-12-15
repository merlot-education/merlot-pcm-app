import { StackNavigationProp } from '@react-navigation/stack';
import React, { useState } from 'react';
import { useAgent } from '@aries-framework/react-hooks';
import { parseUrl } from 'query-string';
import { Agent } from '@aries-framework/core';
import { StyleSheet, View } from 'react-native';
import { useIsFocused } from '@react-navigation/core';
import { Buffer } from 'buffer';
import { useTranslation } from 'react-i18next';
import QRScanner from '../../components/inputs/QRScanner';
import { ScanStackParams, Screens, TabStacks } from '../../types/navigators';
import QrCodeScanError from '../../types/error';
import { ColorPallet } from '../../theme/theme';
import { warningToast, errorToast } from '../../utils/toast';

interface ScanProps {
  navigation: StackNavigationProp<ScanStackParams, Screens.Scan>;
}

const Scan: React.FC<ScanProps> = ({ navigation }) => {
  const { t } = useTranslation();
  const { agent } = useAgent();
  const isFocused = useIsFocused();

  const [qrCodeScanError, setQrCodeScanError] =
    useState<QrCodeScanError | null>(null);
  const [urlInput, setUrl] = useState('');

  const isRedirection = (url: string): boolean => {
    const queryParams = parseUrl(url).query;
    return !(queryParams.c_i || queryParams.d_m);
  };

  const handleRedirection = async (
    url: string,
    agent?: Agent,
  ): Promise<{ url?: string; message?: object }> => {
    try {
      const res = await fetch(url, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });
      if (res.url) {
        const [url] = res.url.split('%');
        return { url };
      } else {
        const message = await res.json();
        return { message };
      }
    } catch (error) {
      errorToast(error);
      throw error;
    }
  };

  const handleCodeScan = async (url: string) => {
    setQrCodeScanError(null);
    try {
      let receivedMessage;
      if (isRedirection(url)) {
        const { url: redirectedUrl, message } = await handleRedirection(
          url,
          agent,
        );
        url = redirectedUrl || url;
        receivedMessage = message;
      }

      if (!(url.includes('?c_i') || url.includes('?d_m') || receivedMessage)) {
        throw new Error('QRScanner.NotAValidURL');
      }

      let message;
      if (receivedMessage) {
        message = receivedMessage;
      } else {
        const [, urlData] = url.includes('?c_i')
          ? url.split('?c_i=')
          : url.split('?d_m=');
        message = JSON.parse(Buffer.from(urlData.trim(), 'base64').toString());
      }

      if (message['~service']) {
        await agent?.receiveMessage(message);
        navigation.navigate(TabStacks.HomeStack);
      } else {
        navigation.navigate(Screens.ConnectionInvitation, { url });
      }
    } catch (e: unknown) {
      const error = new QrCodeScanError('QRScanner.InvalidQrCode', url);
      setQrCodeScanError(error);
    }
  };

  const inputSubmitUrl = async () => {
    try {
      const url = urlInput;
      if (url !== '') {
        if (isRedirection(url)) {
          await handleRedirection(url, agent);
        } else if (url.includes('?c_i') || url.includes('?d_m')) {
          const [, urlData] = url.includes('?c_i')
            ? url.split('?c_i=')
            : url.split('?d_m=');
          const message = JSON.parse(
            Buffer.from(urlData.trim(), 'base64').toString(),
          );
          if (message['~service']) {
            await agent?.receiveMessage(message);
            navigation.navigate(TabStacks.HomeStack);
          } else {
            navigation.navigate(Screens.ConnectionInvitation, { url });
          }
        } else {
          throw new Error(t('QRScanner.NotAValidURL'));
        }
      } else {
        warningToast(t('QRScanner.NotBlankURL'));
      }
    } catch (e: unknown) {
      const error = new QrCodeScanError(t('QRScanner.InvalidQrCode'), urlInput);
      setQrCodeScanError(error);
    }
  };

  return (
    <View style={[styles.container]}>
      {isFocused && (
        <QRScanner
          handleCodeScan={handleCodeScan}
          error={qrCodeScanError}
          enableCameraOnError
          onChangeText={setUrl}
          textInputSubmit={inputSubmitUrl}
        />
      )}
    </View>
  );
};

export default Scan;

const styles = StyleSheet.create({
  container: {
    backgroundColor: ColorPallet.grayscale.white,
  },
});
