import { useNavigation } from '@react-navigation/core'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Modal, StyleSheet, TouchableOpacity, View, Button } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { Title } from '..'
import { Colors, TextTheme } from '../../theme/theme'
import { HomeStackParams } from '../../types/navigators'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  childContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    marginBottom: 35,
    marginHorizontal: 20,
  },
  iconContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  iconButton: {
    padding: 20,
    paddingVertical: 28,
  },
})
interface FlowDetailModalProps {
  title: string
  doneTitle?: string
  onDone?: () => void
  onHome?: () => void
  visible?: boolean
}
const FlowDetailModal: React.FC<FlowDetailModalProps> = ({
  title,
  doneTitle,
  onDone,
  onHome,
  visible,
  children,
}) => {
  const { t } = useTranslation()
  const navigation = useNavigation<StackNavigationProp<HomeStackParams>>()
  const [modalVisible, setModalVisible] = useState<boolean>(true)

  useEffect(() => {
    if (visible !== undefined) {
      setModalVisible(visible)
    }
  }, [visible])

  const close = () => {
    setModalVisible(false)
  }

  const closeHome = () => {
    close()
    navigation.navigate('Home')
  }

  return (
    <Modal visible={modalVisible} transparent>
      <View style={styles.container}>
        <View style={styles.iconContainer}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={onHome || closeHome}
          >
            <Icon name="home" size={24} color={Colors.text} />
          </TouchableOpacity>
        </View>
        <View style={styles.childContainer}>
          <Title style={TextTheme.headingFour}>{title}</Title>
          {children}
        </View>
        <View style={styles.buttonContainer}>
          <Button
            title={doneTitle || t('Global.Done')}
            onPress={onDone || close}
          />
        </View>
      </View>
    </Modal>
  )
}

export default FlowDetailModal
