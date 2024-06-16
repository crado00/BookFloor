import React, { useState, useEffect, useRef } from 'react';
import { View, Button, Text, Image, Dimensions, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Camera, useCameraDevice, useCameraPermission } from 'react-native-vision-camera';
import axios from 'axios';
import RNFS from 'react-native-fs';

const { width: screenWidth, height: screenHeight } = Dimensions.get('screen');

interface bookData {
  bookId: string;
  bookName: string;
  img: string;
}

export default function App() {
  const { hasPermission, requestPermission } = useCameraPermission();
  const [photoView, setPhotoView] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [ocrText, setOcrText] = useState('');
  const [textPairs, setTextPairs] = useState<string[]>([]);
  const device = useCameraDevice('back');
  const camera = useRef<Camera>(null);

  useEffect(() => {
    const requestCameraPermission = async () => {
      await requestPermission();
    };

    requestCameraPermission();
  }, []);

  const temData = [
    {
      bookId: '1',
      bookName: '임시데이터 1',
      bookImg: 'https://gongu.copyright.or.kr/gongu/wrt/cmmn/wrtFileImageView.do?wrtSn=9046601&filePath=L2Rpc2sxL25ld2RhdGEvMjAxNC8yMS9DTFM2L2FzYWRhbFBob3RvXzI0MTRfMjAxNDA0MTY=&thumbAt=Y&thumbSe=b_tbumb&wrtTy=10004',

    },
    {
      bookId: '2',
      bookName: '임시데이터 2',
      bookImg: 'https://gongu.copyright.or.kr/gongu/wrt/cmmn/wrtFileImageView.do?wrtSn=9046601&filePath=L2Rpc2sxL25ld2RhdGEvMjAxNC8yMS9DTFM2L2FzYWRhbFBob3RvXzI0MTRfMjAxNDA0MTY=&thumbAt=Y&thumbSe=b_tbumb&wrtTy=10004',

    },
    {
      bookId: '3',
      bookName: '임시데이터 3',
      bookImg: 'https://gongu.copyright.or.kr/gongu/wrt/cmmn/wrtFileImageView.do?wrtSn=9046601&filePath=L2Rpc2sxL25ld2RhdGEvMjAxNC8yMS9DTFM2L2FzYWRhbFBob3RvXzI0MTRfMjAxNDA0MTY=&thumbAt=Y&thumbSe=b_tbumb&wrtTy=10004',

    },
    {
      bookId: '4',
      bookName: '임시데이터 4',
      bookImg: 'https://gongu.copyright.or.kr/gongu/wrt/cmmn/wrtFileImageView.do?wrtSn=9046601&filePath=L2Rpc2sxL25ld2RhdGEvMjAxNC8yMS9DTFM2L2FzYWRhbFBob3RvXzI0MTRfMjAxNDA0MTY=&thumbAt=Y&thumbSe=b_tbumb&wrtTy=10004',

    }
  ]
  const takePhoto = async () => {
    if (!camera.current) return;
    try {
      const photo = await camera.current.takePhoto({
        flash: 'off',
      });
      setCapturedPhoto(photo.path);
      setPhotoView(true);
      console.log('Photo taken:', photo.path);
      await extractText('photo.path');
    } catch (error) {
      console.error('Error taking photo:', error);
    }
  };

  const extractText = async (imageUri: string) => {
    console.log('Starting text extraction');
    
    try {
      const base64Data = await RNFS.readFile(imageUri, 'base64');
      console.log('Base64 data:', base64Data.slice(0, 100)); // Base64 데이터의 첫 100자만 로그로 출력

      const data = {
        requests: [
          {
            image: {
              content: base64Data, // base64 데이터 직접 사용
            },
            features: [
              {
                type: 'TEXT_DETECTION',
              },
            ],
          },
        ],
      };

      const response = await axios.post(
        'https://vision.googleapis.com/v1/images:annotate?key=AIzaSyDbsEDrJQFrZNdzQNpCEWo8A9hqCuQNa-I', // API 키를 여기에 입력하세요
        data,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('Response from Google Vision API:', response.data);

      if (response.data.responses[0].error) {
        console.error('API Error:', response.data.responses[0].error);
      } else {
        const detectedText = response.data.responses[0].fullTextAnnotation?.text || '';
        setOcrText(detectedText);
        processText(detectedText);
      }
    } catch (error) {
      console.error('Error during OCR request:', error.response?.data || error.message);
    }
  };

  const processText = (text: string) => {
    const splitText = text.split('~');
    const pairs: string[] = [];
    for (let i = 0; i < splitText.length - 1; i += 1) {
      pairs.push(`${splitText[i]}`);
    }
    setTextPairs(pairs);
  };

  const cancel = () => {
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

  const renderItem =  ({item}: {item: bookData}) =>{
    <TouchableOpacity>
      <View style = {{flexDirection: 'row'}}>
        <View style ={{width: 100, height: 100}}>
          <Image source={{uri: item.img}} style = {{width: '100%', height: '100%'}}/>
        </View>
        <View>
          <Text>{item.bookName}</Text>
        </View>
      </View>
    </TouchableOpacity>
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
            <Button title="되돌리기" onPress={cancel} />
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
    alignItems: 'center',
  },
  cameraContainer: {
    width: screenWidth,
    height: screenHeight * 0.5,
    marginTop: 50,
  },
  image: {
    width: '100%',
    height: '100%',
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
