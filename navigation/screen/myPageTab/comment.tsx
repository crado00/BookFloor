import React, { useState, useEffect } from 'react';
import { View, Image, StyleSheet, Text, FlatList } from 'react-native';
import { storeUserData, retrieveUserData } from '../rogin/auth'

interface data{
    cmntid: string;
    img: string;
    contents: string;
}


export default function comment (){

    const userData = retrieveUserData();
    
    var list = '';
    var data;

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
                data = JSON.parse(list)
            }
        })
        .catch((error) => {
            console.error(error);
        });
    }, []);

    data = [
        {
            cmntid: 'a1',
            img: 'https://gongu.copyright.or.kr/gongu/wrt/cmmn/wrtFileImageView.do?wrtSn=9046601&filePath=L2Rpc2sxL25ld2RhdGEvMjAxNC8yMS9DTFM2L2FzYWRhbFBob3RvXzI0MTRfMjAxNDA0MTY=&thumbAt=Y&thumbSe=b_tbumb&wrtTy=10004',
            contents: 'a3',
        }
    ]
    const renderItem = ({ item }: { item: data }) => (
        <View style={styles.scrollView}>
            <View style = {{height: 80, width: 50, borderWidth: 2, borderColor: 'black'}}>
                <Image source = {{uri: item.img}} style ={{width: '100%', height: '100%',}}/>
            </View>
            <View style = {{marginLeft: 20, flex: 1}}>
                <View style = {{flex: 1}}>
                    <Text style = {{fontSize: 16}}>{item.contents}</Text>
                </View>
            </View>
          
        </View>
      );

    return(
        <View>
            <FlatList
                data={data} // 데이터 배열을 전달
                renderItem={renderItem} // renderItem 함수를 전달하여 각 항목을 렌더링
                keyExtractor={(item) => item.cmntid} // 각 항목의 고유 키를 추출하는 함수
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    divider: {
        borderLeftWidth: 1,
        borderLeftColor: 'black'
    },
    scrollView:{
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        flexDirection: 'row',
        height: 100
    },
});