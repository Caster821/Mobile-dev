import React, { useState, useRef } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';

export default function CameraScreen() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [photo, setPhoto] = useState<string | null>(null);
  const cameraRef = useRef<CameraView>(null);

  if (!permission) return <View />;
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{marginBottom: 10}}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  const takePicture = async () => {
    if (cameraRef.current) {
      const data = await cameraRef.current.takePictureAsync();
      if(data?.uri) setPhoto(data.uri);
    }
  };

  if (photo) {
    return (
      <View style={styles.container}>
        <Image source={{ uri: photo }} style={styles.preview} />
        <Button title="Retake" onPress={() => setPhoto(null)} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
        <View style={styles.controls}>
          <TouchableOpacity 
            style={styles.button} 
            onPress={() => setFacing(current => (current === 'back' ? 'front' : 'back'))}>
            <Text style={styles.text}>Flip</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.captureBtn} onPress={takePicture} />
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1 
  },
  camera: { 
    flex: 1 
  },
  preview: { 
    flex: 1, 
    resizeMode: 'contain', 
    backgroundColor: 'black' 
  },
  controls: { 
    flex: 1, 
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    alignItems: 'flex-end', 
    marginBottom: 30 
  },
  button: { 
    padding: 10, 
    backgroundColor: 'rgba(0,0,0,0.5)', 
    borderRadius: 5 
  },
  text: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: 'white' 
  },
  captureBtn: { 
    width: 70, 
    height: 70, 
    borderRadius: 35, 
    backgroundColor: 'white', 
    borderWidth: 5, 
    borderColor: 'gray' }
});