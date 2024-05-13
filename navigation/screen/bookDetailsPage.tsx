import React, { useState , useEffect } from 'react';
import { View, StyleSheet, Button, Text , Image, TouchableOpacity, FlatList, Dimensions} from 'react-native';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import { storeUserData, retrieveUserData } from './rogin/auth'
import { useNavigation  } from '@react-navigation/native';
import { Screen } from 'react-native-screens';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
export default function(){

    const styles = StyleSheet.create({
        img: {
            width: screenWidth,
            height: screenHeight * 0.5,
            borderWidth: 2,
            borderColor: 'gray',
        },
        titleView: {
            alignItems: 'center'
        },
        textView: {
            alignItems: 'center'
        }
    })
    const data = [{
        bookID: '9791161571379',
        img: 'https://image.aladin.co.kr/product/29858/98/cover/k432838027_1.jpg',
        title: '불편한 편의점 :김호연 장편소설',
        writer: '지은이: 김호연',
        publisher: '나무옆의자'
    }]
    return(
        <View style = {{flex: 1, backgroundColor: 'white'}}>
            <View style = {styles.img}>
                <Image style = {{width: '100%', height: '100%'}} source={{uri: data[0].img}} resizeMode="contain"/>
            </View>
            <View style = {styles.titleView}>
                <Text>
                    {data[0].title}
                </Text>
            </View>
            <View style = {styles.textView}>
                <Text>
                    {data[0].writer}
                </Text>
            </View>
            <View style = {styles.textView}>
                <Text style = {{textAlign: 'center'}}>
                    {data[0].publisher}
                </Text>
            </View>
            <View>
                <Text>
                    
                </Text>
            </View>
            <View>
                <Text>
                    
                </Text>
            </View>
            <TouchableOpacity>
                <View>

                </View>
                <View>

                </View>
            </TouchableOpacity>
            <TouchableOpacity>
                <View>

                </View>
            </TouchableOpacity>
        </View>
    )
}