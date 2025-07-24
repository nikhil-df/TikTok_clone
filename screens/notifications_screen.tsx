import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const NotificationsScreen = () => (
  <View style={styles.container}>
    <Text style={styles.text}>Notifications Screen</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4D55CC',
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  text: {
    color: '#fff',
    fontSize: 24, 
    fontWeight: 'bold' }
});

export default NotificationsScreen;
