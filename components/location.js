import React, { useState } from 'react';
import { View, StyleSheet, Modal, TouchableOpacity, Text } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Icon from 'react-native-vector-icons/FontAwesome';
import API_Key from '../utils/normal'

const PlaceAutoComplete = () => {
  const [search, setSearch] = useState(false);

  const handleSearchPress = () => {
    setSearch(true);
  }

  const handleSearchClose = () => {
    setSearch(false);
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.searchButton}
        onPress={handleSearchPress}>
        <Icon name="search" size={25} color={"gray"}/>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={false}
        visible={search}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={handleSearchClose}>
              <Text style={styles.closeButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.modalContent}>
            <GooglePlacesAutocomplete
              placeholder="Search City"
              minLength={2}
              onPress={(data, details = null) => {
                console.log(data,details);
                handleSearchClose();
              }}
              query={{
                key: API_Key, 
                language: 'en',
                type:"(cities)",
              }}

              styles={{
                textInput:{
                  borderWidth:2,
                  borderColor:'black',
                  borderRadius:15,
                }
              }}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    marginTop:50,
  },
  searchButton: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalHeader: {
    padding: 10,
    marginTop: 60,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  closeButtonText: {
    color: '#007BFF',
    fontSize: 16,
  },
  modalContent: {
    flex: 1,
  },
});

export default PlaceAutoComplete;