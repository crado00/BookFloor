import React, { useState, useEffect, useRef } from 'react';
import { View, Button, Text, Image, Dimensions, StyleSheet } from 'react-native';
import { Camera, useCameraDevices, CameraDevice } from 'react-native-vision-camera';
import axios from 'axios';

export default function App() {
  const screenWidth = Dimensions.get('screen').width;
  const screenHeight = Dimensions.get('screen').height;
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [photoView, setPhotoView] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [ocrText, setOcrText] = useState('');
  const [textPairs, setTextPairs] = useState<string[]>([]);
  const devices = useCameraDevices();
  const device = devices.back as CameraDevice | undefined;
  const camera = useRef<Camera>(null);

  useEffect(() => {
    const requestCameraPermission = async () => {
      const status = await Camera.requestCameraPermission();
      setHasPermission(status === 'authorized');
    };

    requestCameraPermission();
  }, []);

  const takePhoto = async () => {
    if (!camera.current) return;
    try {
      const photo = await camera.current.takePhoto({
        flash: 'off',
      });
      setCapturedPhoto(photo.path);
      setPhotoView(true);
      extractText(photo.path);
    } catch (error) {
      console.error('Error taking photo:', error);
    }
  };

  const extractText = async (imageUri: string) => {
    const imageBase64: string = await fetch(imageUri).then(res => res.blob()).then(blob => {
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    });

    const data = {
      requests: [
        {
          image: {
            content: imageBase64.split(',')[1],
          },
          features: [
            {
              type: 'TEXT_DETECTION',
            },
          ],
        },
      ],
    };

    const config = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer YOUR_GOOGLE_CLOUD_VISION_API_KEY`,
      },
    };

    try {
      const response = await axios.post(
        'https://vision.googleapis.com/v1/images:annotate',
        data,
        config
      );

      const detectedText = response.data.responses[0].fullTextAnnotation.text;
      setOcrText(detectedText);
      processText(detectedText);
    } catch (error) {
      console.error('Error during OCR request:', error);
    }
  };

  const processText = (text: string) => {
    const splitText = text.split('~');
    const pairs: string[] = [];
    for (let i = 0; i < splitText.length - 1; i += 2) {
      pairs.push(`${splitText[i]} - ${splitText[i + 1]}`);
    }
    setTextPairs(pairs);
  };

  const cansel = () => {
    setPhotoView(false);
  };

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
            <Button title="되돌리기" onPress={cansel} />
          </View>
          <View style={styles.textPairContainer}>
            {textPairs.map((pair, index) => (
              <Text key={index} style={styles.pairText}>{pair}</Text>
            ))}
          </View>
        </View>
      ) : (
        <View style={styles.container}>
          <View style={styles.cameraContainer}>
            {device && (
              <Camera
                style={StyleSheet.absoluteFill}
                device={device}
                isActive={true}
                photo={true}
                ref={camera}
              />
            )}
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
    padding: 20,
  },
  cameraContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 300,
    height: 400,
  },
  buttonContainer: {
    marginTop: 20,
  },
  textPairContainer: {
    marginTop: 20,
  },
  pairText: {
    marginTop: 10,
  },
});