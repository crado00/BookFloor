import React, { useState, useEffect, useRef } from 'react';
import { View, Button, Text, Image, Dimensions, StyleSheet, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import { Camera, useCameraDevice, useCameraPermission } from 'react-native-vision-camera';
import axios from 'axios';
import RNFS from 'react-native-fs';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { CommonType } from './navigation/types';

type OcrPageNavigationProp = StackNavigationProp<CommonType.RootStackPageList, 'ocrPage'>;

const { width: screenWidth, height: screenHeight } = Dimensions.get('screen');

interface BookData {
  bookname: string;
  authors: string;
  class_no: string;
  book_code: string;
}

interface BookData2 extends BookData {
  bookPosition: string;
}

export default function App() {
  const navigation = useNavigation<OcrPageNavigationProp>();
  const { hasPermission, requestPermission } = useCameraPermission();
  const [photoView, setPhotoView] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [ocrText, setOcrText] = useState('');
  const device = useCameraDevice('back');
  const camera = useRef<Camera>(null);
  const [selectedWords, setSelectedWords] = useState<string[][]>([]);
  const [logMessages, setLogMessages] = useState<string[]>([]);
  const [isbn13, setIsbn13] = useState<string | null>(null);
  const [bookData, setBookData] = useState<BookData2[]>([]);
  const [bookPosition, setBookPosition] = useState<string | null>(null);

  useEffect(() => {
    const requestCameraPermission = async () => {
      await requestPermission();
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

  const processText = (text: string) => {
    const words = text.split(/\s+/); // 단어 또는 숫자를 기준으로 분할
    const wordsWithNumbers = words.map(word => ({
      word,
      number: extractNumber(word),
    }));

    // 숫자만 추출하여 정렬
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
    setBookData([]);
  };

  const sendSelectedWordsToServer = async (a: number, b: number) => {
    console.log('Sending words to server:', { a, b });
    try {
      const response = await axios.post('http://172.30.1.60:3000/saveSelectedWords', {
        a,
        b,
      });
      console.log('Data sent to server:', response.data);
      setLogMessages(logMessages => [...logMessages, `Data sent to server: ${response.data}`]);
      if (response.data.isbn13 != null) {
        setIsbn13(response.data.isbn13); 
      }
      if (response.data.bookPosition != null) {
        setBookPosition(response.data.bookPosition); 
      }
      const bookDetails = await fetchBookData(response.data.isbn13, response.data.bookPosition);
      navigateToBookResult(bookDetails);
    } catch (error) {
      console.error('Error sending data to server:', error);
      setLogMessages(logMessages => [...logMessages, `Error sending data to server: ${error.message}`]);
    }
  };

  const fetchBookData = async (isbn: string, bookPosition: string) => {
    const url = `http://data4library.kr/api/itemSrch?authKey=3893e049e54f909aaaf758d6feda80d62f0619816c3d4ab05a76826ae6dbb046&libCode=141263&isbn13=${isbn}&type=ALL&format=json`;
    try {
      const response = await axios.get(url);
      const obj = response.data;
      console.log('API Response:', JSON.stringify(obj, null, 2));

      const booksArray: BookData2[] = [];
      if (obj.response?.docs) {
        obj.response.docs.forEach((item: any) => {
          const book = item.doc;
          const bookCode = book.callNumbers.length > 0 ? book.callNumbers[0].callNumber.book_code : 'N/A';
          console.log(`전달값: bookname=${book.bookname}, authors=${book.authors}, class_no=${book.class_no}, book_code=${bookCode}, bookPosition=${bookPosition}`);
          booksArray.push({
            bookname: book.bookname,
            authors: book.authors,
            class_no: book.class_no,
            book_code: bookCode,
            bookPosition: bookPosition,
          });
        });
      }
      return booksArray;
    } catch (error) {
      console.error(`Error: ${error}`);
      setLogMessages(logMessages => [...logMessages, `Error: ${error.message}`]);
      return [];
    }
  };
  
  const navigateToBookResult = (bookData: BookData2[]) => {
    if (bookData.length > 0) {
      navigation.navigate('ocrBookResult', { bookData });
    }
  };

  const handleSelectedWordPress = async (words: string[]) => {
    console.log('선택된 단어:', words.join(' ~ '));
    setLogMessages(logMessages => [...logMessages, `선택된 단어: ${words.join(' ~ ')}`]);
    if (words.length >= 2) {
      const a = extractNumber(words[0]);
      const b = extractNumber(words[1]);
      await sendSelectedWordsToServer(a, b);
    }
    navigateToBookResult();
  };

  const handleSelectAllPress = async () => {
    const allNumbers = selectedWords.flatMap(pair => pair.map(word => extractNumber(word)));
    const minNumber = Math.min(...allNumbers);
    const maxNumber = Math.max(...allNumbers);
    console.log(`모든 단어 선택됨: ${minNumber} ~ ${maxNumber}`);
    setLogMessages(logMessages => [...logMessages, `모든 단어 선택됨: ${minNumber} ~ ${maxNumber}`]);
    await sendSelectedWordsToServer(minNumber, maxNumber);
    navigateToBookResult();                        
  };

  const renderSelectedWords = () => {
    return (
      <View>
        {selectedWords.map((pair, index) => (
          <TouchableOpacity key={index} onPress={() => handleSelectedWordPress(pair)}>
            <Text style={styles.itemButton}>{pair.join(' ~ ')}</Text>
          </TouchableOpacity>
        ))}
        <View style={styles.buttonRow}>
          <TouchableOpacity onPress={handleSelectAllPress}>
            <Text style={[styles.itemButton, styles.selectAllButton]}>전체 선택</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderBookData = () => {
    console.log('책 정보 표시:', bookData);
    return (
      <View>
        {bookData.map((book, index) => (
          <View key={index} style={styles.bookItem}>
            <Text style={styles.bookName}>책 이름: {book.bookname}</Text>
            <Text style={styles.bookDetail}>저자: {book.authors}</Text>
            <Text style={styles.bookDetail}>분류 번호: {book.class_no}</Text>
            <Text style={styles.bookDetail}>책 코드: {book.book_code}</Text>
            <Text style={styles.bookDetail}>위치: {book.bookPosition}</Text>
          </View>
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
            {isbn13 && (
              <View style={styles.isbnContainer}>
                <Text style={styles.isbnText}>ISBN13: {isbn13}</Text>
              </View>
            )}
            {renderBookData()}
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
            <Button
              title="test"
              onPress={async () => {
                console.log('테스트 버튼 눌림');
                await sendSelectedWordsToServer(833.6, 843);
                console.log('sendSelectedWordsToServer 완료');
                navigateToBookResult();
              }}
            />
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
});