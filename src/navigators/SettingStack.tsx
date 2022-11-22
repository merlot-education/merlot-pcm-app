import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'
import ChangePin from '../screens/ChangePin'
import Settings from '../screens/Settings'
import ExportWallet from '../screens/ExportWallet'
import { Screens, SettingStackParams } from '../types/navigators'

import defaultStackOptions from './defaultStackOptions'
import Language from '../screens/Language'
import { MainStackContext } from '../utils/helpers'
import ViewMnemonic from '../screens/ViewMnemonic'

const Stack = createStackNavigator<SettingStackParams>()

interface SettingStackProp {
  setAuthenticated: React.Dispatch<React.SetStateAction<boolean>>
}

const SettingStack: React.FC<SettingStackProp> = () => {
  const { value: { setAuthenticated } } = React.useContext(MainStackContext)
  return (
    <Stack.Navigator screenOptions={{ ...defaultStackOptions }}>
      <Stack.Screen name={Screens.Settings}>
        {props => <Settings {...props} setAuthenticated={setAuthenticated} />}
      </Stack.Screen>
      <Stack.Screen name={Screens.Language} component={Language} />
      <Stack.Screen
        name={Screens.ExportWallet}
        component={ExportWallet}
        options={() => ({
          title: 'Export Wallet',
        })}
      />
      <Stack.Screen
        name={Screens.ViewMnemonic}
        component={ViewMnemonic}
        options={() => ({
          title: 'View Mnemonic',
        })}
      />
      <Stack.Screen
        name={Screens.ChangePin}
        component={ChangePin}
        options={{ headerShown: true }}
      />
    </Stack.Navigator>
  )
}

export default SettingStack
