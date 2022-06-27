import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, Text, View, Image, ImageProps } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import useNotifications from '../hooks/notifcations'
import { ColorPallet, TextTheme } from '../theme/theme'
import { Screens, TabStackParams, TabStacks } from '../types/navigators'
import SettingStack from './SettingStack'
import ContactStack from './ContactStack'
import CredentialStack from './CredentialStack'
import HomeStack from './HomeStack'
import Images from '../assets'

const MainTabNavigator = createBottomTabNavigator<TabStackParams>()

type TabBarIconProps = {
  focused: boolean
  imageName: ImageProps['source']
}

type TabBarLabelProps = {
  label: string
}

const TabBarIcon = ({ imageName, focused }: TabBarIconProps) => {
  return (
    <Image
      source={imageName}
      style={
        !focused
          ? styles.tabBarIcon
          : [
              styles.tabBarIcon,
              { backgroundColor: ColorPallet.baseColors.white },
            ]
      }
      resizeMode="contain"
    />
  )
}

const TabBarLabel = ({ label }: TabBarLabelProps) => {
  return (
    <Text
      style={{
        ...TextTheme.label,
        fontWeight: 'normal',
        paddingBottom: 5,
        color: ColorPallet.grayscale.white,
      }}
      numberOfLines={1}
    >
      {label}
    </Text>
  )
}

const ScannerIcon = () => {
  return (
    <View style={styles.scannerIconWrapper}>
      <Image
        source={Images.scanIcon}
        style={styles.scanIcon}
        resizeMode="contain"
      />
    </View>
  )
}

const styles = StyleSheet.create({
  tabBarStyle: {
    height: 70,
    backgroundColor: ColorPallet.brand.primary,
    borderTopWidth: 0,
    paddingBottom: 0,
  },
  scannerIconWrapper: {
    height: 60,
    width: 60,
    backgroundColor: ColorPallet.baseColors.white,
    top: -10,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabBarIcon: {
    height: 40,
    width: 40,
  },
  scanIcon: {
    height: 40,
    width: 40,
  },
})

const TabStack: React.FC = () => {
  const { total } = useNotifications()
  const { t } = useTranslation()

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: ColorPallet.brand.primary }}
    >
      <MainTabNavigator.Navigator
        screenOptions={{
          tabBarStyle: styles.tabBarStyle,
          tabBarActiveTintColor: ColorPallet.baseColors.white,
          tabBarInactiveTintColor: ColorPallet.brand.primary,
          header: () => null,
          tabBarHideOnKeyboard: true,
          unmountOnBlur: true,
        }}
      >
        <MainTabNavigator.Screen
          name={TabStacks.HomeStack}
          component={HomeStack}
          options={{
            tabBarIcon: ({ focused }) => (
              <TabBarIcon focused={focused} imageName={Images.homeIcon} />
            ),
            tabBarLabel: () => <TabBarLabel label={t('TabStack.Home')} />,
            tabBarBadge: total || null,
            tabBarBadgeStyle: {
              backgroundColor: ColorPallet.semantic.error,
            },
            tabBarIconStyle: {
              backgroundColor: ColorPallet.baseColors.white,
            },
            unmountOnBlur: true,
          }}
        />
        <MainTabNavigator.Screen
          name={TabStacks.ConnectionStack}
          component={ContactStack}
          options={{
            headerTitle: 'Connection',
            tabBarIcon: ({ focused }) => (
              <TabBarIcon
                focused={focused}
                imageName={Images.connectionsIcon}
              />
            ),
            tabBarLabel: () => (
              <TabBarLabel label={t('TabStack.Connections')} />
            ),
            unmountOnBlur: true,
          }}
        />
        <MainTabNavigator.Screen
          name={TabStacks.ScanStack}
          options={{
            tabBarIcon: () => <ScannerIcon />,
            tabBarLabel: () => <TabBarLabel label={t('TabStack.Scan')} />,
            tabBarAccessibilityLabel: t('TabStack.Scan'),
          }}
          listeners={({ navigation }) => ({
            tabPress: e => {
              e.preventDefault()
              navigation.navigate(Screens.Scan)
            },
          })}
        >
          {/* Just a placeholder, the the tab will navigate to a different stack */}
          {() => <View />}
        </MainTabNavigator.Screen>
        <MainTabNavigator.Screen
          name={TabStacks.CredentialStack}
          component={CredentialStack}
          options={{
            tabBarIcon: ({ focused }) => (
              <TabBarIcon
                focused={focused}
                imageName={Images.credentialsIcon}
              />
            ),
            tabBarLabel: () => (
              <TabBarLabel label={t('TabStack.Credentials')} />
            ),
            unmountOnBlur: true,
          }}
        />
        <MainTabNavigator.Screen
          name={TabStacks.SettingsStack}
          component={SettingStack}
          options={{
            tabBarIcon: ({ focused }) => (
              <TabBarIcon focused={focused} imageName={Images.settingsIcon} />
            ),
            tabBarLabel: () => <TabBarLabel label={t('TabStack.Settings')} />,
            unmountOnBlur: true,
          }}
        />
      </MainTabNavigator.Navigator>
    </SafeAreaView>
  )
}

export default TabStack
