import Icon from 'react-native-vector-icons/MaterialIcons'
import React from 'react'
import { StyleSheet, View, Keyboard, Button } from 'react-native'
import TextInput from './TextInput'
import { ColorPallet } from '../../theme/theme'
// styles
const styles = StyleSheet.create({
  container: {
    marginLeft: 15,
    marginRight: 5,
    height: 70,
    justifyContent: 'center',
    alignItems: 'flex-start',
    flexDirection: 'row',
    width: '90%',
  },
  searchBar__unclicked: {
    marginLeft: 15,
    marginRight: 15,
    height: 60,
    flexDirection: 'row',
    width: '95%',
    backgroundColor: '#d9dbda',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  searchBar__clicked: {
    marginLeft: 15,
    marginRight: 10,
    height: 60,
    flexDirection: 'row',
    width: '70%',
    backgroundColor: '#d9dbda',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  input: {
    fontSize: 18,
    marginLeft: 10,
    alignSelf: 'center',
    width: '90%',
  },
  buttonStyle: {
    marginTop: 20,
  },
})

interface Props {
  clicked: boolean
  searchPhrase: string
  setSearchPhrase: (text: string) => void
  setClicked: (value: boolean) => void
}
const SearchBar: React.FC<Props> = ({
  clicked,
  searchPhrase,
  setSearchPhrase,
  setClicked,
}) => {
  return (
    <View style={styles.container}>
      <View
        style={
          clicked ? styles.searchBar__clicked : styles.searchBar__unclicked
        }
      >
        {/* search Icon */}
        <Icon
          name="search"
          color={ColorPallet.grayscale.darkGrey}
          size={20}
          style={{
            paddingLeft: 0.5,
            paddingTop: 0.5,
            marginTop: 15,
            marginLeft: 10,
          }}
        />
        {/* Input field */}
        <TextInput
          label=""
          style={styles.input}
          placeholder="Search"
          value={searchPhrase}
          onChangeText={setSearchPhrase}
          onFocus={() => {
            setClicked(true)
          }}
        />
        {/* cross Icon, depending on whether the search bar is clicked or not */}
        {clicked && (
          <Icon
            name="close"
            size={20}
            color="black"
            style={{ padding: 1, marginTop: 15 }}
            onPress={() => {
              setSearchPhrase('')
              setClicked(false)
            }}
          />
        )}
      </View>
      {/* cancel button, depending on whether the search bar is clicked or not */}
      {clicked && (
        <View style={styles.buttonStyle}>
          <Button
            title="Cancel"
            onPress={() => {
              Keyboard.dismiss()
              setClicked(false)
              setSearchPhrase('')
            }}
          />
        </View>
      )}
    </View>
  )
}
export default SearchBar
