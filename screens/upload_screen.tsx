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
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 24, fontWeight: 'bold' }
});

export default UploadScreen;
