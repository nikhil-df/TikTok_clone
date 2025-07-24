import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import HomeScreen from './home_screen';
import UploadScreen from './upload_screen';
import DiscoverScreen from './discover_screen';
import ProfileScreen from './profile_screen';
import NotificationsScreen from './notifications_screen';

const Tab = createBottomTabNavigator();

const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarIconStyle: { marginTop: 10 },
        tabBarStyle: {
          height: 60,
          backgroundColor: '#ffffff',
        },
        tabBarActiveTintColor: '#211C84',
        tabBarInactiveTintColor: '#4D55CC',
        tabBarIcon: ({ color, size }) => {
          let iconName;

          switch (route.name) {
            case 'Home': iconName = 'home'; break;
            case 'Notification': iconName = 'notifications'; break;
            case 'Upload': iconName = 'add-box'; break;
            case 'Discover': iconName = 'explore'; break;
            case 'Profile': iconName = 'person'; break;
            default: iconName = 'circle';
          }

          return <MaterialIcon name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Notification" component={NotificationsScreen} />
      <Tab.Screen name="Upload" component={UploadScreen} />
      <Tab.Screen name="Discover" component={DiscoverScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default MainTabs;
