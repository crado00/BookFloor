import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Button, Text, Image, Dimensions, NativeModules } from 'react-native';
import { Camera, useCameraDevices, CameraPermissionStatus, PhotoFile } from 'react-native-vision-camera';

const { ApiService } = NativeModules;

export default function App() {
  const screenWidth = Dimensions.get('screen').width;
  const screenHeight = Dimensions.get('screen').height;
  const [permission, setPermission] = useState<CameraPermissionStatus | null>(null);
  const [photoView, setPhotoView] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [ocrText, setOcrText] = useState("a");
  const devices = useCameraDevices();
  const camera = useRef<Camera>(null);

  useEffect(() => {
    const requestCameraPermission = async () => {
      const status = await Camera.requestCameraPermission();
      setPermission(status);
    };

    requestCameraPermission();
  }, []);

  const takePhoto = async () => {
    if (camera.current == null) return;
    try {
      const photo: PhotoFile = await camera.current.takePhoto({
        flash: 'off',
      });
      setCapturedPhoto(photo.path);
      setPhotoView(true);

      // OCR 기능 호출
      const ocrResult = await ApiService.performOCR(photo.path);
      setOcrText(ocrResult);

    } catch (error) {
      console.error('Error taking photo:', error);
    }
  };

  if (permission === null || permission === 'not-determined') {
    return (
      <View style={styles.container}>
        <Text>Requesting for camera permission...</Text>
      </View>
    );
  }

  if (permission === 'denied') {
    return (
      <View style={styles.container}>
        <Text>Camera permission denied</Text>
      </View>
    );
  }

  if (!devices.back) {
    return (
      <View style={styles.container}>
        <Text>Loading camera...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {photoView ? (
        <View style={styles.container}>
          <View style={styles.cameraContainer}>
            <Image source={{ uri: `file://${capturedPhoto}` }} style={styles.image} />
          </View>
          <View style={styles.buttonContainer}>
            <View style={{ borderWidth: 2, borderColor: 'gray', width: 300, height: 200, padding: 7 }}>
              <Text style={{ flex: 1 }}>{ocrText}</Text>
            </View>
            <Button title="되돌리기" onPress={() => setPhotoView(false)} />
          </View>
        </View>
      ) : (
        <View style={styles.container}>
          <View style={styles.cameraContainer}>
            <Camera
              style={StyleSheet.absoluteFill}
              device={devices.back}
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