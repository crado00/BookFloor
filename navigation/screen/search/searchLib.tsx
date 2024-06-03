import React, { useState, useEffect} from "react";
import { View, StyleSheet, Button, Text, Image, TouchableOpacity, ScrollView, ActivityIndicator, Dimensions, FlatList } from 'react-native';
import axios from 'axios';

function searchLiblist(latitude: number, longtitude: number){
    const [data, setData] = useState([]);
    

    const setLibmap1 = async (lat: number, long: number) =>{
        const url = `exmaple/url?lat=${lat}&long=${long}` //연결 코드 필요
        const library = []

        try {
            const response = await axios.get(url);
            const obj = response.data;

            if(obj.response && obj.response.libs){//예제임 보내는 값에 따라 변경해야됨
                obj.response.libs.array.forEach((item) => {
                    const lib = item.lib
                    library.push({
                        libName: lib.libName,
                        address: lib.address,
                        tel: lib.tel,
                        latitude: lib.latitude,
                        longtitude: lib.longtitude
                    });
                    setData(lib);
                });
            }
        } catch (error) {
            console.error(`Error: ${error}`);
        }
    }
    setLibmap1(latitude, longtitude);
    return data;
    
}//위도 , 위도 델타, 경도, 경도 델타, 델타는 줌인 줌아웃

function searchLibmap(bookId: string){
    const setLibmap2 = async () =>{
        const authKey = '3893e049e54f909aaaf758d6feda80d62f0619816c3d4ab05a76826ae6dbb046';
        const url = `http://data4library.kr/api/libSrchByBook?authKey=${authKey}&isbn=${bookId}&region=31040`
        const library = []
        try {
            const response = await axios.get(url);
            const obj = response.data;
            if (obj.response && obj.response.libs) {
                obj.response.libs.array.forEach((item) => {
                    const lib = item.lib
                    library.push({
                        libName: lib.libName,
                        address: lib.address,
                        tel: lib.tel,
                        latitude: lib.latitude,
                        longtitude: lib.longtitude
                    });
                    setData(lib);
                });

            }
        }catch(error){
            console.error(`Error: ${error}`);
        }

    }
    const [data, setData] = useState([]);
    setLibmap2(id);
    return data;
}
export default {searchLiblist, searchLibmap};