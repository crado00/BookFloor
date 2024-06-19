import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { retrieveUserData } from './rogin/auth';
import { Item } from 'react-native-paper/lib/typescript/components/Drawer/Drawer';

const BookRecommendation = async () => {
  const authKey = '3893e049e54f909aaaf758d6feda80d62f0619816c3d4ab05a76826ae6dbb046'


      try {
      const data = await retrieveUserData();

        const response = await axios.get(`http://172.16.38.97:3001/ai/recommendBooks/${data.userId}`)
        
        const dataset: {bookId: string; bookName: string; img: string;}[] =[]
        const obj = response.data;
        if (obj.response && obj.response.predicted_isbns){
          obj.response.predicted_isbns.forEach(async (item) =>{
            const url = `http://data4library.kr/api/srchBooks?authKey=${authKey}&isbn13=${item}&pageNo=1&pageSize=10&format=json`;
            const responseset = await axios.get(url)
            const obj = responseset.data;
        if (obj.response && obj.response.docs) {
          obj.response.docs.forEach((item) => {
            const book = item.doc;
            dataset.push({
              bookId: book.isbn13,
              bookName: book.bookname,
              img: book.bookImageURL
            })
          })

        }
            
          })
        }
        return dataset;

      } catch (error) {
        console.error(error);
        return null;
      }




};



export default BookRecommendation;
