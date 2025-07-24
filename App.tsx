import { getAuth, onAuthStateChanged } from '@react-native-firebase/auth';
import { useEffect, useState } from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import LottieView from 'lottie-react-native';
import firestore from '@react-native-firebase/firestore';
import LoginScreen from "./screens/login_screen";
import UserRegistration from "./screens/user_registration";
import { ActivityIndicator, View } from 'react-native';
import MainTabs from './screens/MainTabs';

const Stack = createNativeStackNavigator();
export let triggerAppReload: () => void;

function App() {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [profileComplete, setProfileComplete] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [reloadVersion, setReloadVersion] = useState(0);
  triggerAppReload = () => {
    setReloadVersion(prev => prev + 1);
  };
  useEffect(() => {
    GoogleSignin.configure({
      webClientId: '794647222037-3q1pqkn2279m6h2947qlnei400f6gihe.apps.googleusercontent.com',
    });

    const unsubscribeAuth = onAuthStateChanged(getAuth(), async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        const email = firebaseUser.email || "";

        try {
          const querySnapshot = await firestore().collection('users').where('email', '==', email).get();

          if (!querySnapshot.empty) {
            setProfileComplete(true);
          } else {
            setProfileComplete(false);
          }
        } catch (e: any) {
          setProfileComplete(false);
        }
      } else {
        setUser(null);
        setProfileComplete(null);
      }
    });
    setLoading(false);
    return () => unsubscribeAuth();
  }, [reloadVersion]);

  if (loading) {
    return (
      <View style={{ backgroundColor: '#4D55CC', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <LottieView
          source={require('./assets/loading/loading.json')}
          autoPlay
          loop
          style={{ width: '60%', height: '60%' }}
        />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            {user === null ? (
              <Stack.Screen name="Login" component={LoginScreen} />
            ) : profileComplete === false ? (
              <Stack.Screen name="UserRegistration" component={UserRegistration} />
            ) : (
              <Stack.Screen name="MainTabs" component={MainTabs} />
            )}
          </Stack.Navigator>
        </NavigationContainer>


      </SafeAreaView>
    </SafeAreaProvider>
  );
}

export default App;
