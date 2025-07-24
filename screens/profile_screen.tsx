import { View, Text, StyleSheet, Alert, ActivityIndicator , Image, TouchableOpacity } from 'react-native';
import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import React, { useEffect, useState } from 'react';
import { getAuth } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';



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

function ProfileScreen ()  {
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
      <View style={styles.center}>
        <ActivityIndicator size="large" />
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
      <Text style={styles.title}>User Profile</Text>
        <Image source={{ uri: userData.image }} style={{ width: 100, height: 100, borderRadius: 50 }}/>
      <Text>Name: {userData.name || 'N/A'}</Text>
      <Text>Email: {userData.email || 'N/A'}</Text>
      <TouchableOpacity onPress={handleLogout} style={{ marginTop: 20, padding: 10, backgroundColor: '#f00', borderRadius: 5 }}>
        <Text style={{ color: '#fff' }}>Logout</Text>
      </TouchableOpacity>
    </View>
  );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  center: {
    flex:1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize:24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});
export default ProfileScreen;
