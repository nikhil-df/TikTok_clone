import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Image } from 'react-native';
import { GoogleAuthProvider, getAuth, signInWithCredential } from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';


async function onGoogleButtonPress() {
  await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
  const signInResult = await GoogleSignin.signIn();
  const idToken = signInResult.data?.idToken;
  if (!idToken) {
    throw new Error('No ID token found');
  }

  const googleCredential = GoogleAuthProvider.credential(idToken);
  signInWithCredential(getAuth(), googleCredential);
}


function LoginScreen() {
  return (
  <View style={styles.container}>
    <TouchableOpacity onPress={() => {onGoogleButtonPress()}} style={styles.button}>
      <Image source={require('../assets/images/google.png')} style={styles.image} />
      <Text style={styles.text}>Login</Text>
    </TouchableOpacity>
  </View>
)};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#211C84',
     flex: 1, 
     justifyContent: 'center', 
     alignItems: 'center' 
    },
  text: { 
    color: '#fff',
    fontSize: 24, 
    paddingLeft: 10,
    fontWeight: 'bold' 
  },
  button: {
    flexDirection: 'row',
    backgroundColor: '#4D55CC',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#B5A8D5',
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 20, 
  },
});

export default LoginScreen;
