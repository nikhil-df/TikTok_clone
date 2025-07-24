import { View, Text, StyleSheet, Alert, ActivityIndicator, Image, TouchableOpacity, TurboModuleRegistry } from 'react-native';
import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import React, { useEffect, useState } from 'react';
import { getAuth } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import LottieView from 'lottie-react-native';



type UserData = {
  name?: string;
  email?: string;
  image?: string;
};


const handleLogout = async () => {
  try {
    await auth().signOut();
    await GoogleSignin.revokeAccess();
    await GoogleSignin.signOut();
  } catch {
    Alert.alert("Error", "Failed to log out. Please try again.");
  }
};

function ProfileScreen() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (!currentUser?.email) {
      setUserData(null);
      setLoading(false);
      return;
    }

    const fetchUserData = async () => {
      try {
        const querySnapshot = await firestore().collection('users').where('email', '==', currentUser.email).get();

        if (!querySnapshot.empty) {
          const userDoc = querySnapshot.docs[0];
          setUserData(userDoc.data());
        } else {
          setUserData(null);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setUserData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);


  if (loading) {
    return (
      <View style={{ backgroundColor: '#4D55CC', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <LottieView
          source={require('../assets/loading/loading.json')}
          autoPlay
          loop
          style={{ width: '60%', height: '60%' }}
        />
      </View>
    );
  }

  if (!userData) {
    return (
      <View style={styles.center}>
        <Text>No user data found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{userData.name}</Text>
      <Image source={{ uri: userData.image }} style={styles.image} />
      <Text style={styles.email} >{userData.email}</Text>
      <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
        <Text style={{ color: '#fff', fontWeight :'bold' }}>Logout</Text>
      </TouchableOpacity>
    </View>
  );

}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#4D55CC',
    flex: 1,
    padding: 20,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
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
  email:{
    color: '#fff',
    fontSize: 20,
    marginBottom: 20,
  },
  logoutButton: {
    backgroundColor: '#f00',
    padding: 10,
    borderRadius: 5,
    alignItems: 'baseline',
  },
});
export default ProfileScreen;
