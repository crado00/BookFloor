import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Button, Text , Image, TouchableOpacity, TextInput, Dimensions} from 'react-native';
import MapPage from './mapPage';

interface Library {
    libCode: string;
    libName: string;
    tel: string;
    closed: string;
    operatingTime: string;
    address: string;
    latitude: number;
    longitude: number;
  }
  
export default function(){
    const library =[
        {
            libCode: '1',
            libName: '도서관',
            tel: '010-2345-6789',
            closed: '휴관일',
            operatingTime: '운영시간',
            address: '주소',
            latitude: 37.498040483,
            longitude: 127.02758183,
        }
    ]

    

    return (
        <View style = {{flex: 1}}>
            <MapPage libraries={library}/>
        </View>
    )
}