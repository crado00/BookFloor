import React, { useState, useEffect }  from "react";
import { View, Image, StyleSheet, FlatList, TouchableOpacity,Text } from "react-native";


interface books{
    bookId: string,
    bookName: string,
    img: string
}

export default function(){

    const books = [
        {
            bookId: '1',
            bookName: '확인용',
            img: 'https://gongu.copyright.or.kr/gongu/wrt/cmmn/wrtFileImageView.do?wrtSn=9046601&filePath=L2Rpc2sxL25ld2RhdGEvMjAxNC8yMS9DTFM2L2FzYWRhbFBob3RvXzI0MTRfMjAxNDA0MTY=&thumbAt=Y&thumbSe=b_tbumb&wrtTy=10004'
        },
        {
            bookId: '2',
            bookName: '확인용',
            img: 'https://gongu.copyright.or.kr/gongu/wrt/cmmn/wrtFileImageView.do?wrtSn=9046601&filePath=L2Rpc2sxL25ld2RhdGEvMjAxNC8yMS9DTFM2L2FzYWRhbFBob3RvXzI0MTRfMjAxNDA0MTY=&thumbAt=Y&thumbSe=b_tbumb&wrtTy=10004'
        },
        {
            bookId: '3',
            bookName: '확인용',
            img: 'https://gongu.copyright.or.kr/gongu/wrt/cmmn/wrtFileImageView.do?wrtSn=9046601&filePath=L2Rpc2sxL25ld2RhdGEvMjAxNC8yMS9DTFM2L2FzYWRhbFBob3RvXzI0MTRfMjAxNDA0MTY=&thumbAt=Y&thumbSe=b_tbumb&wrtTy=10004'
        },
        {
            bookId: '4',
            bookName: '확인용',
            img: 'https://gongu.copyright.or.kr/gongu/wrt/cmmn/wrtFileImageView.do?wrtSn=9046601&filePath=L2Rpc2sxL25ld2RhdGEvMjAxNC8yMS9DTFM2L2FzYWRhbFBob3RvXzI0MTRfMjAxNDA0MTY=&thumbAt=Y&thumbSe=b_tbumb&wrtTy=10004'
        },
        {
            bookId: '5',
            bookName: '확인용',
            img: 'https://gongu.copyright.or.kr/gongu/wrt/cmmn/wrtFileImageView.do?wrtSn=9046601&filePath=L2Rpc2sxL25ld2RhdGEvMjAxNC8yMS9DTFM2L2FzYWRhbFBob3RvXzI0MTRfMjAxNDA0MTY=&thumbAt=Y&thumbSe=b_tbumb&wrtTy=10004'
        },
    ]

    const bookAdd = {
        bookId: '0',
        bookName: '도서 추가',
        img: 'https://gongu.copyright.or.kr/gongu/wrt/cmmn/wrtFileImageView.do?wrtSn=9046601&filePath=L2Rpc2sxL25ld2RhdGEvMjAxNC8yMS9DTFM2L2FzYWRhbFBob3RvXzI0MTRfMjAxNDA0MTY=&thumbAt=Y&thumbSe=b_tbumb&wrtTy=10004'
    }
    books.push(bookAdd)

    const btn = (key: string) => {
        if(key === '0'){
            console.log('1번')
        }else{
            console.log('2번')
        }
    }

    const randerItem = ({item}: {item: books}) => (
        <TouchableOpacity style = { styles.itemContainer } onPress={() => btn(item.bookId)}>
            <View style ={ {width: '100%', height: '100%'} }>
                <View style = {{flex: 1}}>
                    <Image style ={ {width: "100%", height: '100%'} } source={{ uri: item.img }}/>
                </View>
                <View style = {{alignItems: 'center', backgroundColor: 'white'}}>
                    <Text>{item.bookName}</Text>
                </View>
            </View>
        </TouchableOpacity>
        )

    return (
        <View style = {styles.container}>
            <View style = {{alignItems: 'center'}}>
                <Text style = { {fontSize: 40,} }>내 서재</Text>
            </View>
            
            <FlatList
                data={books}
                renderItem={randerItem}
                keyExtractor={(item) => item.bookId}
                numColumns={3}
                columnWrapperStyle={styles.columnWrapper}
                style = {{ padding: 20,  backgroundColor: 'gray'}}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        margin: 5, // 각 아이템의 간격을 일정하게 설정
        padding: 10,
    },
    listContent: {
        paddingHorizontal: 10,
    },
    columnWrapper: {
        flexWrap: 'wrap', // 아이템들이 넘치면 줄바꿈이 되도록 설정
        justifyContent: 'flex-start',
    },
    itemContainer: {
        margin: 5, // 각 아이템의 간격을 일정하게 설정
        padding: 10,
        width: 100,
        height: 140
      },
})