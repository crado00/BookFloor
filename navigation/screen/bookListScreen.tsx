import React, { useState, useEffect, useRef  } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Button, Modal,ScrollView } from 'react-native';
import axios from 'axios'; 
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { CommonType } from './navigation/types';

type bookListScreenNavigationProp = StackNavigationProp<CommonType.RootStackPageList, 'bookListScreen'>;

interface BookData3 {
  class_no: string;
  book_code: string;
}


const BookListScreen = ({ route }) => {
  const { bookList, a, b } = route.params;
  const [logMessages, setLogMessages] = useState<string[]>([]); 
  const [modalVisible, setModalVisible] = useState(false);
  const [modalText, setModalText] = useState('');
  const [positionSearch, setPositionSearch] = useState('');
  const [classNo, setClassNo] = useState('');
  const [isbn13, setIsbn13] = useState('');
  const [classCode, setClassCode] = useState('');
  const navigation = useNavigation<bookListScreenNavigationProp>();

  const handleBookPress = async (isbn13: string) => {
    if (!isbn13) {
      setLogMessages(logMessages => [...logMessages, 'ISBN13 is undefined']);
      return;
    }
    console.log('Selected Book ISBN:', isbn13);
    const url = `http://data4library.kr/api/itemSrch?authKey=3893e049e54f909aaaf758d6feda80d62f0619816c3d4ab05a76826ae6dbb046&libCode=141263&isbn13=${isbn13}&type=ALL&format=json`;
    try {
      const response = await axios.get(url);
      const obj = response.data;
      console.log('API Response:', JSON.stringify(obj, null, 2));

      const booksArray: BookData3[] = [];
      if (obj.response?.docs) {
        obj.response.docs.forEach((item: any) => {
          const book = item.doc;
          const bookCode = book.callNumbers.length > 0 ? book.callNumbers[0].callNumber.book_code : 'N/A';
          const classNumber = book.class_no;
          const modalContent = `청구기호: ${book.class_no} ${bookCode}`;
          setModalText(modalContent);
          setClassNo(classNumber);
          setClassCode(bookCode);
          setModalVisible(true);
          
        });
        setIsbn13(isbn13);
      }
      return booksArray;
    } catch (error) {
      console.error(`Error: ${error}`);
      setLogMessages(logMessages => [...logMessages, `Error: ${error.message}`]);
      return [];
    }
  };

  const renderBookList = () => {
    console.log('Rendering Book List:', bookList);
    return (
      <View>
        {bookList.map((book, index) => (
          <TouchableOpacity key={index} onPress={() => handleBookPress(book.isbn13)}>
            <View style={styles.bookItem}>
              <Text style={styles.bookName}>책 이름: {book.bookname}</Text>
              <Text style={styles.bookDetail}>저자: {book.authors}</Text>
              <Text style={styles.bookDetail}>ISBN: {book.isbn13}</Text>
              {book.bookImageURL ? (
                <Image source={{ uri: book.bookImageURL }} style={styles.bookImage} />
              ) : (
                <Text>No Image Available</Text>
              )}
            </View>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {renderBookList()}
      {logMessages.map((message, index) => (
        <Text key={index} style={styles.logMessage}>{message}</Text>
      ))}

      {/* 모달 컴포넌트 */}
      <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(!modalVisible);
      }}
    >
      <View style={styles.modalView}>
        <Text style={styles.modalText}>{modalText}</Text>
        <Button title="닫기" onPress={() => setModalVisible(false)} />
        <Button 
          title="OCR로 위치 찾기" 
          onPress={() => {
            setModalVisible(false);
            navigation.navigate('ocrPage2', { class_no: classNo, class_code:classCode, isbn13:isbn13 });
          }} 
        />
      </View>
    </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
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
  logMessage: {
    marginTop: 10,
    fontSize: 12,
    color: 'red',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
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
  openButton: {
    backgroundColor: '#F194FF',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginTop: 16,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});

export default BookListScreen;