import Icon from 'react-native-vector-icons/MaterialIcons'
import React from 'react'
import { StyleSheet, View, Keyboard, Button, TextInput } from 'react-native'
import { ColorPallet } from '../../theme/theme'
// styles
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: '95%',
  },
  searchbarUnclicked: {
    marginLeft: 15,
    marginRight: 15,
    height: 50,
    flexDirection: 'row',
    width: '95%',
    backgroundColor: '#d9dbda',
    borderRadius: 10,
  },
  searchbarClicked: {
    marginLeft: 15,
    marginRight: 10,
    height: 50,
    flexDirection: 'row',
    width: '70%',
    backgroundColor: '#d9dbda',
    borderRadius: 10,
  },
  input: {
    fontSize: 18,
    alignSelf: 'center',
    width: '90%',
  },
  buttonStyle: {
    alignSelf: 'center',
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
  console.log('search phrase', searchPhrase)
  return (
    <View style={styles.container}>
      <View
        style={clicked ? styles.searchbarClicked : styles.searchbarUnclicked}
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
          // label=""
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
            style={{ alignSelf: 'center' }}
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
