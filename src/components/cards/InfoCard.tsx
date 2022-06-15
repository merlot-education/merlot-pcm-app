import React from 'react'
import { Image, StyleSheet, Text, View } from 'react-native'

import { ColorPallet, TextTheme } from '../../theme/theme'
import Images from '../../assets'

export interface TextBoxProps {
  children: string | React.ReactNode
  showTopIcon?: boolean
  showBottomIcon?: boolean
}

const iconSize = 30

const styles = StyleSheet.create({
  container: {
    backgroundColor: ColorPallet.grayscale.veryLightGrey,
    borderRadius: 20,
    padding: 20,
    minHeight: 250,
  },
  headerText: {
    ...TextTheme.normal,
    color: ColorPallet.baseColors.black,
    marginTop: 10,
  },
  bottomIconContainer: {
    alignSelf: 'center',
  },
  bottomIcon: {
    width: 60,
    height: 60,
  },
})

const InfoCard: React.FC<TextBoxProps> = ({
  children,
  showTopIcon = false,
  showBottomIcon = false,
}) => {
  return (
    <View style={styles.container}>
      {showTopIcon && (
        <View>
          <Image
            source={Images.infoIcon}
            style={{ width: iconSize, height: iconSize }}
          />
        </View>
      )}
      <Text
        style={styles.headerText}
        testID="InfoCard"
        accessibilityLabel="InfoCard"
      >
        {children}
      </Text>
      {showBottomIcon && (
        <View style={styles.bottomIconContainer}>
          <Image source={Images.termsIcon} style={styles.bottomIcon} />
        </View>
      )}
    </View>
  )
}

export default InfoCard
