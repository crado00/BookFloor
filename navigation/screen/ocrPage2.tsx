import React, { useState, useEffect, useRef } from 'react';
import { View, Button, Text, TextInput, Image, Modal, Dimensions, StyleSheet, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import { Camera, useCameraDevice, useCameraPermission } from 'react-native-vision-camera';
import axios from 'axios';
import RNFS from 'react-native-fs';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { CommonType } from './navigation/types';


type OcrPage2NavigationProp = StackNavigationProp<CommonType.RootStackPageList, 'ocrPage2'>;

const { width: screenWidth, height: screenHeight } = Dimensions.get('screen');


const ocrPage2 = ({ route })=> {
  const navigation = useNavigation<OcrPage2NavigationProp>();
  const { hasPermission, requestPermission } = useCameraPermission();
  const [photoView, setPhotoView] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [ocrText, setOcrText] = useState('');
  const device = useCameraDevice('back');
  const camera = useRef<Camera>(null);
  const [isbn13, setIsbn13] = useState<string | null>(null);
  const [classCode, setClassCode] = useState<string | null>(null);
  const [selectedWords, setSelectedWords] = useState<string[][]>([]);
  const [logMessages, setLogMessages] = useState<string[]>([]);
  const [bookPosition, setBookPosition] = useState<string | null>(null);
  const [a, setA] = useState('');
  const [b, setB] = useState('');
  const [classNo, setClassNo] = useState<number | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [classNoPosition, setClassNoPosition] = useState<string | null>(null);


  useEffect(() => {
    const { classNo, classCode, isbn13 } = route.params;
    console.log('Route params:', route.params);
    setClassNo(classNo);
    setClassCode(classCode);
    setIsbn13(isbn13);
    const requestCameraPermission = async () => {
      await requestPermission();
    };

    requestCameraPermission();
  }, [route.params]);

  
  //사진 촬영
  const takePhoto = async () => {
    if (!camera.current) return;
    try {
      const photo = await camera.current.takePhoto({
        flash: 'off',
      });
      setCapturedPhoto(photo.path);
      setPhotoView(true);
      console.log('Photo view set to true');
      console.log('Photo taken:', photo.path);
      setLogMessages(logMessages => [...logMessages, `Photo taken: ${photo.path}`]);
      await extractText(photo.path);
    } catch (error) {
      console.error('Error taking photo:', error);
      setLogMessages(logMessages => [...logMessages, `Error taking photo: ${error.message}`]);
    }
  };


  useEffect(() => {
    console.log('photoView state changed:', photoView);
  }, [photoView]);

  //OCR
  const extractText = async (imageUri: string) => {
    console.log('Starting text extraction');
    setLogMessages(logMessages => [...logMessages, 'Starting text extraction']);
    
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
      setLogMessages(logMessages => [...logMessages, `Response from Google Vision API: ${JSON.stringify(response.data)}`]);

      if (response.data.responses[0].error) {
        console.error('API Error:', response.data.responses[0].error);
        setLogMessages(logMessages => [...logMessages, `API Error: ${response.data.responses[0].error.message}`]);
      } else {
        const detectedText = response.data.responses[0].fullTextAnnotation?.text || '';
        console.log('Detected Text:', detectedText); // Detected Text 로그 출력
        setLogMessages(logMessages => [...logMessages, `Detected Text: ${detectedText}`]);
        setOcrText(detectedText);
        processText(detectedText);
      }
    } catch (error) {
      console.error('Error during OCR request:', error.response?.data || error.message);
      setLogMessages(logMessages => [...logMessages, `Error during OCR request: ${error.message}`]);
    }
  };

  const extractNumber = (word: string) => {
    const match = word.match(/\d+(\.\d+)?/);
    return match ? parseFloat(match[0]) : 0;
  };

  //OCR 결과 후처리
  const processText = (text: string) => {
    const words = text.split(/\s+/); // 단어 또는 숫자를 기준으로 분할
    const wordsWithNumbers = words.map(word => ({
      word,
      number: extractNumber(word),
    }));

    const sortedWords = wordsWithNumbers.sort((a, b) => b.number - a.number);

    const selected: string[][] = [];

    for (let i = 0; i < sortedWords.length; i++) {
      const currentWord = sortedWords[i].word;

      if (currentWord.includes('~') || currentWord.includes('-')) {
        const previousWords = sortedWords.slice(i + 1).filter(w => w.number < sortedWords[i].number && !w.word.includes('~') && !w.word.includes('-'));

        if (previousWords.length > 0) {
          const matchedWord = previousWords[0].word;
          selected.push([matchedWord, currentWord]);
        } else {
          selected.push([currentWord]);
        }
      }
    }

    console.log('Selected words:', selected); // 콘솔에 선택된 단어 출력
    setLogMessages(logMessages => [...logMessages, `Selected words: ${selected.flat().join(', ')}`]);
    setSelectedWords(selected);
  };

  const cancel = () => {
    setPhotoView(false);
    setLogMessages([]);
  };

    //서버로 a,b, isbn13 전송
  const sendSelectedWordsToServer = async (a: number, b: number, isbn13: string) => {
    if (!isbn13) {
      console.error('ISBN13 is missing');
      return;
    }
    console.log('Sending words to server:', { a, b , isbn13});
    try {
      const response = await axios.post('http://221.168.128.40:3000/savetitleSearch', {
        a,
        b,
        isbn13,
      });
      console.log('Data sent to server:', response.data);
      if (response.data.class_no_position) {
        setClassNoPosition(response.data.class_no_position);
        setModalVisible(true);
      }
    } catch (error) {
      console.error('Error sending data to server:', error);
      setLogMessages(logMessages => [...logMessages, `Error sending data to server: ${error.message}`]);
    }
  };


  //범위 선택
  const handleSelectedWordPress = async (words: string[]) => {
    console.log('선택된 단어:', words.join(' ~ '));
    setLogMessages(logMessages => [...logMessages, `선택된 단어: ${words.join(' ~ ')}`]);
    if (words.length >= 2) {
      const a = extractNumber(words[0]);
      const b = extractNumber(words[1]);
      if (isbn13) {
        await sendSelectedWordsToServer(a, b, isbn13);
      } else {
        console.error('ISBN13 is missing');
      }
    }
  };

 
  //범위 생성
  const renderSelectedWords = () => {
    return (
      <View>
        {selectedWords.map((pair, index) => (
          <TouchableOpacity key={index} onPress={() => handleSelectedWordPress(pair)}>
            <Text style={styles.itemButton}>{pair.join(' ~ ')}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
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
          <ScrollView contentContainerStyle={styles.scrollViewContent}>
            {renderSelectedWords()}
          </ScrollView>
          <View style={styles.buttonContainer}>
            <Button title="되돌리기" onPress={cancel} />
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
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>책 위치: {classNoPosition}</Text>
            <Button
              title="확인"
              onPress={() => setModalVisible(!modalVisible)}
            />
          </View>
        </View>
      </Modal>
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
  scrollViewContent: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  textListContainer: {
    marginTop: 20,
    width: '90%',
    alignSelf: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 10,
  },
  itemButton: {
    color: 'black',
    padding: 10,
    backgroundColor: 'lightgray',
    textAlign: 'center',
    borderRadius: 5,
    margin: 5,
  },
  selectAllButton: {
    backgroundColor: 'gray',
  },
  isbnContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: 'lightyellow',
    borderRadius: 5,
  },
  isbnText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  scrollitem: {
    height: 100,
    borderWidth: 2,
    borderColor: 'gray',
    flexDirection: 'row',
    margin: 5,
  },
  imgView: {
    height: 80,
    width: 50,
    margin: 10,
  },
  textGroup: {
    flexDirection: 'column',
    height: 100,
  },
  bookItem: {
    marginTop: 20,
    padding: 10,
    backgroundColor: 'lightblue',
    borderRadius: 5,
  },
  bookName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  bookDetail: {
    fontSize: 14,
    color: 'gray',
  },
  bookImage: {
    width: 100,
    height: 150,
    resizeMode: 'contain',
  },
  inputAndButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '80%',
    marginTop: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
    width: '30%',
  },
  titleContainer:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '80%',
    marginTop: 20,
  },
  screen: {
    flex: 1,
    backgroundColor: '#ffffff'
  },
  text: {
    fontSize: 20
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 18,
  },
});

export default ocrPage2;