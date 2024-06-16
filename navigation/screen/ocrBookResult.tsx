import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

interface BookData {
  bookname: string;
  authors: string;
  class_no: string;
  book_code: string;
}

interface BookData2 extends BookData {
  bookPosition: string;
}

const BookDataScreen = ({ route }) => {
    const { bookData } = route.params;
  
    console.log('BookDataScreen received bookData:', bookData); // 추가된 로그
  
    const renderBookData = () => {
      return (
        <View>
          {bookData.map((book: BookData2, index: number) => (
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
  
    return (
      <ScrollView contentContainerStyle={styles.container}>
        {renderBookData()}
      </ScrollView>
    );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
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
});

export default BookDataScreen;