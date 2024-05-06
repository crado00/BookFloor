import React, { useState , useEffect } from 'react';
import { View, StyleSheet, Button, Text , Image, TouchableOpacity, FlatList} from 'react-native';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import { SearchBar } from 'react-native-screens';
import { storeUserData, retrieveUserData } from './rogin/auth'



const userData = retrieveUserData();

interface bookRank{
    bookId: string;
    bookName: string;
    img: string;
}

interface bookSuggestion{
    bookId: string;
    bookName: string;
    img: string;
}
    







export default function(){

    var list = '';
    var bookRank;
    var bookSuggestion;


    bookSuggestion = [
        {
            bookId: 'b1',
            bookName: '확인용',
            img: 'https://gongu.copyright.or.kr/gongu/wrt/cmmn/wrtFileImageView.do?wrtSn=9046601&filePath=L2Rpc2sxL25ld2RhdGEvMjAxNC8yMS9DTFM2L2FzYWRhbFBob3RvXzI0MTRfMjAxNDA0MTY=&thumbAt=Y&thumbSe=b_tbumb&wrtTy=10004',
        }
    ]
    
    bookRank = [
        {
            bookId: 'b1',
            bookName: '확인용',
            img: 'https://gongu.copyright.or.kr/gongu/wrt/cmmn/wrtFileImageView.do?wrtSn=9046601&filePath=L2Rpc2sxL25ld2RhdGEvMjAxNC8yMS9DTFM2L2FzYWRhbFBob3RvXzI0MTRfMjAxNDA0MTY=&thumbAt=Y&thumbSe=b_tbumb&wrtTy=10004',
        }
    ]

/*
    useEffect(() => {
        fetch('내용 필요', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData),
        }).then((response) => response.json())
        .then((responseJson) => {
            console.log(responseJson);
            if (responseJson.status === 'success') {// 변경 필요 토큰을 가져와야함
                list = JSON.stringify(responseJson.data);
                bookRank = JSON.parse(list)//각각의 정보를 저장해야함
                bookSuggestion = JSON.parse(list)//각각의 정보를 저장해야함
            }
        })
        .catch((error) => {
            console.error(error);
        });
    }, []);
*/

    const renderItem = ({item}: {item: bookRank}) => (
        <TouchableOpacity>
          <View style = {styles.book}>
                <View style = {{flex: 1}}>
                    <Image source={{uri: item.img}} style = {{width: '100%', height: '100%'}}/>
                </View>
                <View style = {{alignItems: 'center', backgroundColor: 'white'}}>
                    <Text>{item.bookName}</Text>
                </View>
            </View>
        </TouchableOpacity>
  
    );
    
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: 'white'
        },
        searchVar: {
            flexDirection: 'row',
            backgroundColor: '#D8D8D8',
            height: 50,
            marginTop: 20
        },
        ScrollView:{
            height: 125,
            backgroundColor: '#D8D8D8'
        },
        book:{
            margin: 10,
            width: 60,
            height: 100,
            backgroundColor: '#D8D8D8'
        }

    })

    return(
    <View style = {styles.container}>
        <View style = {{alignItems: 'center'}}>
        <Text style = {{fontSize: 40}}>책마루</Text>
        </View>
        <View style = {styles.searchVar}>
            <View style = {{flex: 1, borderWidth: 2,borderColor: 'black', margin: 5}}>
                <TextInput placeholder = '책 이름 검색'/>
            </View>
            <Button title='검색'/>
            <Button title='ocr'/>
        </View>
        <Text style = {{marginTop: 30}}>이 주의 추천 도서 </Text>
        <View style = {styles.ScrollView}>
            <FlatList
                data = {bookRank}
                renderItem={renderItem}
                keyExtractor={(item) => item.bookId}
                style = {{flexDirection: 'row'}}
            />
        </View>
        <Text style = {{marginTop: 30}}>사용자 맞춤 추천 도서</Text>
        <View style = {styles.ScrollView}>
            <FlatList
                data = {bookSuggestion}
                renderItem={renderItem}
                keyExtractor={(item) => item.bookId}
                style = {{flexDirection: 'row'}}
            />
        </View>
    </View>);
}