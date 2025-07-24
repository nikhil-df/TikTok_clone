import { getAuth, onAuthStateChanged } from '@react-native-firebase/auth';
import { useEffect, useState } from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import firestore from '@react-native-firebase/firestore';
import LoginScreen from "./screens/login_screen";
import UserRegistration from "./screens/user_registration";
import HomeScreen from "./screens/home_screen";
import UploadScreen from "./screens/upload_screen";
import DiscoverScreen from "./screens/discover_screen";
import ProfileScreen from "./screens/profile_screen";
import NotificationsScreen from './screens/notifications_screen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function App() {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [profileComplete, setProfileComplete] = useState<boolean | null>(null);

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

    return () => unsubscribeAuth();
  }, []);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <NavigationContainer>
          {!user ? (
            <Stack.Navigator screenOptions={{ headerShown: false }}>
              <Stack.Screen name="Login" component={LoginScreen} />
            </Stack.Navigator>
          ) : !profileComplete ? (
            <Stack.Navigator screenOptions={{ headerShown: false }}>
              <Stack.Screen name="Profile" component={UserRegistration} />
            </Stack.Navigator>
          ) : (
            <Tab.Navigator
              screenOptions={({ route }) => ({
                headerShown: false,
                tabBarShowLabel: false,
                tabBarIconStyle: { marginTop: 10 },
                tabBarStyle: {
                  height: 60,
                },

                tabBarIcon: ({ color, size }) => {
                  let iconName;

                  switch (route.name) {
                    case 'Home':
                      iconName = 'home';
                      break;
                    case 'Notification':
                      iconName = 'notifications';
                      break;
                    case 'Upload':
                      iconName = 'add-box';
                      break;
                    case 'Discover':
                      iconName = 'explore';
                      break;
                    case 'Profile':
                      iconName = 'person';
                      break;
                    default:
                      iconName = 'circle';
                  }

                  return <MaterialIcon name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: '#000',
                tabBarInactiveTintColor: 'gray',
              })}
            >
              <Tab.Screen name="Home" component={HomeScreen} />
              <Tab.Screen name="Notification" component={NotificationsScreen} />
              <Tab.Screen name="Upload" component={UploadScreen} />
              <Tab.Screen name="Discover" component={DiscoverScreen} />
              <Tab.Screen name="Profile" component={ProfileScreen} />
            </Tab.Navigator>
          )}
        </NavigationContainer>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

export default App;
