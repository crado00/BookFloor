import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Button, Text, Image, Dimensions } from 'react-native';
import { Camera, useCameraDevice, useCameraPermission } from 'react-native-vision-camera';

export default function App() {
  const screenWidth = Dimensions.get('screen').width;
  const screenHeight = Dimensions.get('screen').height;
  const { hasPermission, requestPermission } = useCameraPermission();
  const [photoView, setPhotoView] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [ocrText, setOcrText] = useState("a")
  const device = useCameraDevice('back');
  const camera = useRef(null);

  useEffect(() => {
    const requestCameraPermission = async () => {
      await requestPermission();
    };

    requestCameraPermission();
  }, [requestPermission]);

  const takePhoto = async () => {
    console.log('확인1');
    if (!camera.current) return;
    console.log('확인2');
    try {
      const photo = await camera.current.takePhoto({
        flash: 'off',
        qualityPrioritization: 'speed',
      });
      console.log('확인3');
      console.log(photo);
      setCapturedPhoto(photo.path);
      setPhotoView(true);
    } catch (error) {
      console.error('Error taking photo:', error);
    }
  };
  const cansel = () => {
    setPhotoView(false);
  }
  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text>Requesting for camera permission...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text>Camera permission denied</Text>
      </View>
    );
  }

  return (
    <View style={{flex: 1}}>
        {photoView ? (
          <View style = {styles.container}>
            <View style={styles.cameraContainer}>
              <Image source={{ uri: `file://${capturedPhoto}` }} style={styles.image} />
            </View>
            <View style={styles.buttonContainer}>
              <View style = {{borderWidth: 2, borderColor: 'gray', width: 300, height: 200, padding: 7}}>
                <Text style={{flex: 1}}>{ocrText}</Text>
              </View>
              <Button title="되돌리기" onPress={cansel} />
            </View>
          </View>

        ) : (
          <View style = {styles.container}>
            <View style={styles.cameraContainer}>
              <Camera
                style={StyleSheet.absoluteFill}
                device={device}
                isActive={true}
                photo={true}
                ref={camera}
              />
            </View>
            <View style={styles.buttonContainer}>
              <Button title="사진 찍기" onPress={takePhoto} />
            </View>
          </View>
        )}

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  cameraContainer: {
    width: Dimensions.get('screen').width,
    height: Dimensions.get('screen').height * 0.5,
    marginTop: 50,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});