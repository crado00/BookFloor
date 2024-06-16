import React, { useState , useEffect } from 'react';
import { View, StyleSheet, Button, Text , Image, TouchableOpacity, FlatList} from 'react-native';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import { storeUserData, retrieveUserData } from './rogin/auth'
import { useNavigation  } from '@react-navigation/native';
import axios from 'axios';


const userData = retrieveUserData();

interface bookRank{
    bookId: string;
    bookName: string;
    img: string;
}

    

export default function(){
    const [searchWord, setSearchWord] = useState<string>('');
    const [libbookRank, setlibbookRank] =useState([]);
    const [bookRank, setbookRank] =useState([]);
    const navigation = useNavigation();
    const key = 'faf460c70f6b5b9163c4fb0b97d3cfc5ea649d7319099d1c7568b8d076a2131f'
    var bookSuggestion;

    
    bookSuggestion = [
        {
            bookId: 'b1',
            bookName: '확인용',
            img: 'https://gongu.copyright.or.kr/gongu/wrt/cmmn/wrtFileImageView.do?wrtSn=9046601&filePath=L2Rpc2sxL25ld2RhdGEvMjAxNC8yMS9DTFM2L2FzYWRhbFBob3RvXzI0MTRfMjAxNDA0MTY=&thumbAt=Y&thumbSe=b_tbumb&wrtTy=10004',
        },
    ]
    
    
    const searchWordChange = (input: string) => {
        setSearchWord(input);
    }
    useEffect(() =>{
        const currentDate = new Date();
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        const year = oneWeekAgo.getFullYear()
        const month = (oneWeekAgo.getMonth() + 1).toString().padStart(2, '0');
        const date = (oneWeekAgo.getDate()).toString().padStart(2, '0');

        
        const url = `https://data4library.kr/api/loanItemSrch?authKey=${key}&startDt=${year}-${month}-${date}&pageSize=10&format=json`
        console.log(`url 날짜 확인: ${url}`);

        const libbookData = async () => {
            try {
                const response = await axios.get(url)
                const obj = response.data;
                const booksArray=[]
                if (obj.response && obj.response.docs) {
                    obj.response.docs.forEach((item) => {
                        const book = item.doc;
                        booksArray.push({
                            bookId: book.isbn13,
                            img: book.bookImageURL,
                            bookName: book.bookname,
                        });
                    });
                }
                setbookRank(booksArray)
            } catch (error) {
                console.log("이번주 추천 에러: " + error)
            }
        }
        libbookData()
    },[])

    useEffect(() =>{
        const url = `http://10.0.2.2:3001/library/popular-book/144177`
        const libbookData = async () => {
            try {
                const response = await axios.get(url)

                const obj = response.data;
                const booksArray=[]
                obj.forEach(element => {
                   const book = element.doc;
                   booksArray.push({
                    bookId: book.isbn13,
                    bookName: book.bookname,
                    img: book.bookImageURL
                   })
                });
                setlibbookRank(booksArray)
            } catch (error) {
                console.log("도서관 추천 에러: " + error)
            }
        }
        libbookData()
    },[setlibbookRank])

    const typing = () =>{

        navigation.navigate('searchPage', {search: searchWord});
    }

    const ocrbtn = () =>{
        
        navigation.navigate('ocrPage');
        
    }
    const bookBtn = (id : string) => {
        navigation.navigate('bookDetailsPage', {id: id});
    }

    const renderItem = ({item}: {item: bookRank}) => {
        return (
          <TouchableOpacity onPress={() => bookBtn(item.bookId)}>
            <View style={styles.book}>
              <View style={{ flex: 1 }}>
                <Image source={{ uri: item.img }} style={{ width: '100%', height: '100%' }} />
              </View>
              <View style={{ alignItems: 'center', backgroundColor: 'white' }}>
                <Text numberOfLines={1} ellipsizeMode="tail">{item.bookName}</Text>
              </View>
            </View>
          </TouchableOpacity>
        );
      };
    
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
            height: 150,
            backgroundColor: '#D8D8D8'
        },
        book:{
            margin: 10,
            width: 80,
            height: 120,
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
                <TextInput placeholder = '책 이름 검색' onChangeText = {searchWordChange} value={searchWord}/>
            </View>
            <Button title='검색' onPress={typing}/>
            <Button title='ocr' onPress={ocrbtn}/>
        </View>
        <Text style = {{marginTop: 30}}>이 주의 추천 도서 </Text>
        <View style = {styles.ScrollView}>
            <FlatList
                data = {bookRank}
                renderItem={renderItem}
                keyExtractor={(item) => item.bookId}
                style = {{flexDirection: 'row'}}
                horizontal

            />
        </View>
        <Text style = {{marginTop: 30}}>이용 도서관 추천도서</Text>
        <View style = {styles.ScrollView}>
            <FlatList
                data = {libbookRank}
                renderItem={renderItem}
                keyExtractor={(item) => item.bookId}
                style = {{flexDirection: 'row'}}
                horizontal
            />
        </View>
        <Text style = {{marginTop: 30}}>사용자 맞춤 추천 도서</Text>
        <View style = {styles.ScrollView}>
            <FlatList
                data = {bookSuggestion}
                renderItem={renderItem}
                keyExtractor={(item) => item.bookId}
                style = {{flexDirection: 'row'}}
                horizontal

            />
        </View>
        
    </View>);
}