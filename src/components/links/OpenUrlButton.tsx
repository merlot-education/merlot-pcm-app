import { Linking, TouchableOpacity } from 'react-native';

export interface OpenURLButtonProps {
  url: string;
  children: React.ReactNode;
}

const OpenURLButton = ({ url, children }: OpenURLButtonProps) => {
  const handleClick = () => {
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      } else {
        console.log("Don't know how to open URI: " + url);
      }
    });
  };
  return <TouchableOpacity onPress={handleClick}>{children}</TouchableOpacity>;
};

export default OpenURLButton;
