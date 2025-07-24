import React, { useState } from 'react';
import { Text, StyleSheet, TextInput, TouchableOpacity, Alert, Image, PermissionsAndroid, Platform, ScrollView } from 'react-native';
import { launchImageLibrary, ImageLibraryOptions } from 'react-native-image-picker';
import RNFS from 'react-native-fs';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';


function UserRegistration() {
  const [name, setName] = useState<string>('');
  const [image, setImage] = useState<string | undefined>();
  const navigation = useNavigation<any>();

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
       navigation.reset({
        index: 0,
        routes: [{ name: 'Home'}],
      });
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
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.text}>User Registration Screen</Text>

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
        value={name}
        onChangeText={(text) => setName(text)}
      />

      <TouchableOpacity onPress={handleRegistration} style={styles.button}>
        <Text style={{ color: '#fff' }}>Submit</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    padding: 20,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  textInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginVertical: 10,
    width: '100%',
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: '#007BFF',
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
    marginTop: 10,
  },
});

export default UserRegistration;
