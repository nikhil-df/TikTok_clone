import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

function UploadScreen () {
return (
  <View style={styles.container}>
    <TouchableOpacity onPress={() => {}} style={{ marginTop: 20 }}>
      <Text style={styles.text}>Upload Video</Text>
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

export default UploadScreen;
