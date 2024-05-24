import React, {useState, useEffect} from "react";
import { View, StyleSheet, Button, Text , Image, TouchableOpacity, FlatList, Keyboard} from 'react-native';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import { useRoute, useNavigation } from '@react-navigation/native';
import { searchCode } from "./search/searchCode"

interface data{
    bookId: string;
    img: string;
    title: string;
    writer: string;
    publisher: string;
}

const authKey = '3893e049e54f909aaaf758d6feda80d62f0619816c3d4ab05a76826ae6dbb046';



export default function(){//도서 검색 키워드를 메인페이지에서 가져오는 코드
    const navigation = useNavigation();
    const route = useRoute();

    const [keyword, setKeyword] = useState<string>('');
    var list;
    const [data, setData] = useState<data[]>([]);
    //const [fetData, setFetData] = useState([])
/*
    data = [{
        bookID: '9791161571379',
        img: 'https://image.aladin.co.kr/product/29858/98/cover/k432838027_1.jpg',
        title: '불편한 편의점 :김호연 장편소설',
        writer: '지은이: 김호연',
        publisher: '나무옆의자'
    }]
    */

    useEffect(() => {
        if (route.params?.search) {
            setKeyword(route.params.search);
            fetchData(route.params.search);
        }

    }, [route.params?.search]);
    const search = () =>{
        fetchData(keyword)
        
    }
    const fetchData = async (keyword: string) => {
        const booksArray = await searchCode(keyword);
        setData(booksArray);
        console.log(`확인용 ${data[0].bookId}`);
    }

    const setKeywordChange = (input: string) => {
        setKeyword(input);
    }

/*
    useEffect(() => {
        const apiUrl = `http://data4library.kr/api/srchBooks?authKey=${authKey}&keyword=${keyword}&pageNo=1&pageSize=10&format=json`;
        const fetchData = async () => {
            try {
              const response = await fetch(apiUrl);
              const json = await response.json();
              setFetData(json);
              console.log(fetData + '확인3');
              const data: data[] = fetData.response.docs.map(doc => {
                console.log('확인2');
                const { bookname, authors, publisher, isbn13, bookImageURL } = doc;
                console.log(bookname + ' 확인1');
                return { 
                    bookID: isbn13, 
                    img: bookImageURL, 
                    title: bookname, 
                    writer: authors, 
                    publisher 
                };
                
              });
              console.log(data + ' 확인');
            } catch (error) {
              console.error('Error fetching data:', error);
            }
          };
      
          fetchData();
    }, [keyword]);
*/
const BookDetails = (id: string) =>{
    console.log(`전달될 정보 : ${id}`)
    navigation.navigate('bookDetailsPage', {id: id})//문제없음
}
    const renderItem = ({item}: {item: data}) =>(
        
        <TouchableOpacity onPress={() => BookDetails(item.bookId)}>
            <View style = {styles.scrollitem}>
                <View style = {styles.imgView}>
                    <Image source = {{uri: item.img}} style = {{width: '100%', height: '100%'}}/>
                </View>
                <View style = {styles.textGruep}>
                    <View>
                        <Text>
                            {item.title}
                        </Text>
                    </View>
                    <View>
                        <Text>
                            {item.writer}
                        </Text>
                    </View>
                    <View>
                        <Text>
                            출판사: {item.publisher}
                        </Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
        
    )

    const styles = StyleSheet.create({
        scrollitem: {
            height: 100,
            borderWidth: 2,
            borderColor: 'gray',
            flexDirection: 'row',
            margin: 5
        },
        imgView: {
            height: 80,
            width: 50,
            margin: 10
        },
        textGruep: {
            flexDirection: 'column',
            height: 100,
        }
    })
    return(
        <View style = {{flex: 1, backgroundColor: 'white'}}>
            <View style = {{backgroundColor: 'gray', flexDirection: 'row', justifyContent: 'flex-start'}}>
                <View style = {{backgroundColor: 'white', margin: 5, flex: 1}}>
                    <TextInput placeholder="도서 검색" value={keyword} onChangeText={setKeywordChange}/>
                </View>
                <Button title="검색" onPress={search}/>
            </View>
            <FlatList
                data={data}
                renderItem={renderItem}
                keyExtractor={(item)=> item.bookId}
            />
        </View>
    );
}

