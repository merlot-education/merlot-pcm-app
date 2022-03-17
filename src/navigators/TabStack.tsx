import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

import useNotifications from '../hooks/notifcations'
import { ColorPallet, TextTheme } from '../theme/theme'
import { Screens, TabStackParams, TabStacks } from '../types/navigators'
import SettingStack from './SettingStack'
import ContactStack from './ContactStack'
import CredentialStack from './CredentialStack'
import HomeStack from './HomeStack'
import ScanStack from './ScanStack'

const MainTabNavigator = createBottomTabNavigator<TabStackParams>()

type TabBarIconProps = {
  focused: boolean
  color: string
  size?: number
  activeIconName: string
  inactiveIconName: string
}

type TabBarlabelProps = {
  focused: boolean
  color?: string
  label: string
}

const TabBarIcon = ({
  color,
  focused,
  activeIconName,
  inactiveIconName,
  size = 30,
}: TabBarIconProps) => {
  return (
    <Icon
      name={focused ? activeIconName : inactiveIconName}
      color={color}
      size={size}
    />
  )
}

const TabBarLabel = ({ color, focused, label }: TabBarlabelProps) => {
  return (
    <Text
      style={{
        ...TextTheme.label,
        fontWeight: 'normal',
        paddingBottom: 5,
        color: focused
          ? ColorPallet.brand.primary
          : ColorPallet.grayscale.white,
      }}
    >
      {label}
    </Text>
  )
}

const ScannerIcon = () => {
  return (
    <View style={styles.scannerIconWrapper}>
      <Icon
        name="qrcode-scan"
        color={ColorPallet.grayscale.white}
        size={32}
        style={{ paddingLeft: 0.5, paddingTop: 0.5 }}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  tabBarStyle: {
    height: 60,
    backgroundColor: ColorPallet.grayscale.mediumGrey,
    shadowOffset: { width: 0, height: -3 },
    shadowRadius: 6,
    shadowColor: ColorPallet.grayscale.black,
    shadowOpacity: 0.1,
    borderTopWidth: 0,
    paddingBottom: 0,
  },
  scannerIconWrapper: {
    height: 60,
    width: 60,
    backgroundColor: ColorPallet.brand.primary,
    top: -20,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
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
          tabBarActiveTintColor: ColorPallet.brand.primary,
          tabBarInactiveTintColor: ColorPallet.grayscale.white,
          header: () => null,
        }}
      >
        <MainTabNavigator.Screen
          name={TabStacks.HomeStack}
          component={HomeStack}
          options={{
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon
                activeIconName="home"
                inactiveIconName="home-outline"
                color={color}
                focused={focused}
              />
            ),
            tabBarLabel: ({ focused }) => (
              <TabBarLabel label={t('TabStack.Home')} focused={focused} />
            ),
            tabBarBadge: total || null,
            tabBarBadgeStyle: {
              backgroundColor: ColorPallet.semantic.error,
            },
          }}
        />
        <MainTabNavigator.Screen
          name={TabStacks.ContactStack}
          component={ContactStack}
          options={{
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon
                activeIconName="account-group"
                inactiveIconName="account-group-outline"
                color={color}
                focused={focused}
              />
            ),
            tabBarLabel: ({ focused }) => (
              <TabBarLabel
                label={t('TabStack.Connections')}
                focused={focused}
              />
            ),
          }}
        />
        <MainTabNavigator.Screen
          name={TabStacks.ScanStack}
          component={ScanStack}
          options={{
            tabBarIcon: () => <ScannerIcon />,
            tabBarLabel: ({ focused }) => (
              <TabBarLabel label={t('TabStack.Scan')} focused={focused} />
            ),
            tabBarAccessibilityLabel: t('TabStack.Scan'),
          }}
          // listeners={({ navigation }) => ({
          //   tabPress: e => {
          //     console.log('scan pressed')
          //     e.preventDefault()
          //     navigation.navigate(TabStacks.ScanStack, { screen: Screens.Scan })
          //   },
          // })}
        />
        {/* </MainTabNavigator.Screen> */}
        <MainTabNavigator.Screen
          name={TabStacks.CredentialStack}
          component={CredentialStack}
          options={{
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon
                activeIconName="wallet"
                inactiveIconName="wallet-outline"
                color={color}
                focused={focused}
              />
            ),
            tabBarLabel: ({ focused }) => (
              <TabBarLabel
                label={t('TabStack.Credentials')}
                focused={focused}
              />
            ),
          }}
        />
        <MainTabNavigator.Screen
          name={TabStacks.SettingsStack}
          component={SettingStack}
          options={{
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon
                activeIconName="account-cog"
                inactiveIconName="account-cog-outline"
                color={color}
                focused={focused}
              />
            ),
            tabBarLabel: ({ focused }) => (
              <TabBarLabel label={t('TabStack.Settings')} focused={focused} />
            ),
          }}
        />
      </MainTabNavigator.Navigator>
    </SafeAreaView>
  )
}

export default TabStack
