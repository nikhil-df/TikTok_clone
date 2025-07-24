import React, { useState } from 'react';
import { Text, StyleSheet, TextInput, TouchableOpacity, Alert, Image, PermissionsAndroid, Platform, ScrollView, View } from 'react-native';
import { launchImageLibrary, ImageLibraryOptions } from 'react-native-image-picker';
import RNFS from 'react-native-fs';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { triggerAppReload } from '../App';


function UserRegistration() {
  const [name, setName] = useState<string>('');
  const [image, setImage] = useState<string | undefined>();


  const handleRegistration = async () => {
    if (!name.trim() || !image) {
      Alert.alert('Error', 'Please fill in all fields and select an image');
      return;
    }

    const userId = firestore().collection('users').doc().id;
    const email = auth().currentUser?.email;

    try {
      await firestore().collection('users').doc(userId).set({
        name,
        email,
        image,
      });

      Alert.alert('Success', 'User registered successfully');
      setName('');
      setImage(undefined);
      triggerAppReload();
    } catch (error) {
      Alert.alert('Error', 'Failed to register user. Please try again');
      console.error(error);
    }
  };

  const selectImage = async () => {
    try {
      const options: ImageLibraryOptions = {
        mediaType: 'photo',
        includeBase64: false,
      };

      launchImageLibrary(options, async (response) => {
        if (response.didCancel) {
          Alert.alert('Cancelled', 'You cancelled image picker');
        } else if (response.errorCode) {
          Alert.alert('Error', 'Unable to select image. Please try again.');
        } else if (response.assets && response.assets.length > 0) {
          const selectedImage = response.assets[0];

          if (selectedImage.uri && selectedImage.type) {
            const base64 = await RNFS.readFile(selectedImage.uri, 'base64');
            const base64Image = `data:${selectedImage.type};base64,${base64}`;
            setImage(base64Image);
          }
        }
      });
    } catch (err) {
      Alert.alert('Error', 'Permission error. Please try again.');
      console.error(err);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={selectImage} style={{ marginTop: 20 }}>
        <Image
          source={
            image
              ? { uri: image }
              : require('../assets/images/placeholder.jpg') // fallback
          }
          style={styles.image}
        />
      </TouchableOpacity>

      <TextInput
        style={styles.textInput}
        placeholder="Enter your name"
        placeholderTextColor="#fff"
        value={name}
        onChangeText={(text) => setName(text)}
      />

      <TouchableOpacity onPress={handleRegistration} style={styles.button}>
        <Text style={styles.text}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#4D55CC',
    paddingTop: 180,
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  text: {
    color: '#000',
    fontSize: 20,
    fontWeight: 'medium',
  },
  textInput: {
    height: 40,
    borderColor: '#B5A8D5',
    color: '#fff',
    borderRadius: 8,
    borderWidth: 1.5,
    width: '100%',
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: '#f4f4f4',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
    width: '100%',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 25,
    borderWidth: 3,
    borderColor: '#B5A8D5',
    shadowOffset: { width: 0, height: 2 },
    shadowColor: 'rgba(0, 0, 0, 0.3)',
  },
});

export default UserRegistration;
