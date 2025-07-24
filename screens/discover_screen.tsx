import React, { useRef } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { StyleSheet } from 'react-native';

function DiscoverScreen () {
return (
  <View style={styles.container}>
    <TouchableOpacity onPress={() => {}} style={{ marginTop: 20 }}>
      <Text style={styles.text}>Discover Video</Text>
    </TouchableOpacity>
  </View>
);
}

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

export default DiscoverScreen;
