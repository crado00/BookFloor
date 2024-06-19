import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Button, Text, Image, TouchableOpacity, ScrollView, ActivityIndicator, Dimensions, FlatList, TextInput } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import axios from 'axios';
import Geolocation from "react-native-geolocation-service"
import {
    request,
    PERMISSIONS,
    requestLocationAccuracy,
    requestMultiple,
  } from 'react-native-permissions';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export default function() {
    const route = useRoute();
    const [bookid, setBookid] = useState('');
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true); // 로딩 상태 추가
    const [showView, setShowView] = useState(false);
    const [showLibrarys, setShowLibrarys] = useState(false);
    const [libdata, setlibdata] = useState([]);
    const [search, setSearch] = useState('')
    const authKey = '3893e049e54f909aaaf758d6feda80d62f0619816c3d4ab05a76826ae6dbb046';
    const navigation = useNavigation();

    useEffect(() => {
        if (route.params?.id) {
            setBookid(route.params.id);
            setDetails(route.params.id);
        }
    }, [route.params?.id]);

    const setDetails = async (id) => {
        
        const url = `http://data4library.kr/api/srchDtlList?authKey=${authKey}&isbn13=${id}&loaninfoYN=Y&format=json`;

        try {
            const response = await axios.get(url);
            const obj = response.data;
            if (obj.response && obj.response.detail) {
                const newData = obj.response.detail.map((item) => {
                    const details = item.book;
                    return {
                        title: details.bookname,
                        writer: details.authors,
                        publisher: details.publisher,
                        class: details.class_nm,
                        description: details.description,
                        img: details.bookImageURL
                    };
                });
                setData(newData);
            }
        } catch (error) {
            console.error(`Error: ${error}`);
        } finally {
            setLoading(false); // 로딩 완료
        }
    };

    const setLibList = async () => {
        
        requestMultiple([
            PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
            PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION,
          ])
            .then((status) => {
              console.log(`Location request status: ${status}`);
            })
            .catch((e) => {
              console.error(`Location request has been failed: ${e}`);
            });

            const location = () => Geolocation.getCurrentPosition(
                (positon) =>{
                  const {latitude, longitude} = positon.coords
                  setlib(latitude,longitude);
                },
                (error) => {
                  console.log(error)
                },
                {
                  enableHighAccuracy: true,
                  timeout: 20000,
                  maximumAge: 0,
                  distanceFilter: 1
                }
              )
              location()
        
    }

    const setlib = async (lat: number, long: number) =>{
        const url = `http://172.16.38.97:3001/library/find/`//연결 코드 추가
    
            console.log('전송시작')
          try{
          const response = await axios.get(url,
            {
                params: {
                    latitude: lat,
                    longitude: long,
                    latitude_delta: 0.05,
                    longitude_delta: 0.05,
                    isbn13: bookid
                }
            }
        )
          const obj = response.data.flat()

          if(obj){
              const newData = obj.map((item) => {
                const setlat = Number(item.LATITUDE);
                const setlong = Number(item.LONGITUDE);
                  return {
                      libCode: item.LBRRY_CD,
                      libName: item.LIBRARY_NAME,
                      tel: item.LIBRARY_TEL,
                      closed: item.LIBRARY_CLOSED,
                      operatingTime: item.OPERATINGTIME,
                      address: item.ADDRESS,
                      latitude: setlat,
                      longitude: setlong
                  }
              })
              setlibdata(newData)
              setShowLibrarys(!showLibrarys);
          }
          }catch(e){
              console.log(e)
          }
        }

    const libMap = () => {
        navigation.navigate('booklibsel', {data: libdata});
    }
    const toggle = () => {
        setShowView(!showView);
    };
    const librarys = () => {
        setLibList()
    };
    const redata = () =>{
        setShowLibrarys(!showLibrarys);
    }

    const styles = StyleSheet.create({
        img: {
            width: screenWidth,
            height: screenHeight * 0.5,
            borderWidth: 2,
            borderColor: 'gray',
        },
        titleView: {
            margin: 10,
            alignItems: 'center',
            marginTop: 5,
        },
        textView: {
            alignItems: 'center',
            marginTop: 5,
        },
        classificationView: {
            alignItems: 'center',
            marginTop: 5,
        },
        bookIntroduction: {
            alignItems: 'center',
            marginLeft: 20,
            marginRight: 20,
            marginTop: 5,
            flex: 1,
        },
        btnStatus: {
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 5,
            borderWidth: 2,
            borderColor: 'gray',
            borderRadius: 50,
        },
        divider: {
            borderLeftWidth: 1,
            borderLeftColor: 'black',
            height: 20,
        },
        listItem: {
            borderWidth: 1,
            borderLeftColor: 'black',
            margin: 5,
        },
        list: {
            borderWidth: 1,
            borderLeftColor: 'black',
            flex: 1
        }
    });

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    

    const renderItem = ({item}: {item: bookId}) => (
            <View style = {styles.listItem}>
            <Text>{item.libName}</Text>
                <Text numberOfLines={1} ellipsizeMode="tail" >휴관일: {item.closed}</Text>
                <Text numberOfLines={1} ellipsizeMode="tail" >운영시간: {item.operatingTime}</Text>
                <Text>주소: {item.address}</Text>
            </View>
    )
    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <View style={styles.img}>
                <Image
                    style={{ width: '100%', height: '100%' }}
                    source={{ uri: data[0]?.img || 'https://gongu.copyright.or.kr/gongu/wrt/cmmn/wrtFileImageView.do?wrtSn=9046601&filePath=L2Rpc2sxL25ld2RhdGEvMjAxNC8yMS9DTFM2L2FzYWRhbFBob3RvXzI0MTRfMjAxNDA0MTY=&thumbAt=Y&thumbSe=b_tbumb&wrtTy=10004' }}
                    resizeMode="contain"
                />
            </View>
            {showView ? ( // 키워드 버튼 클릭 시 이 뷰로 변경
                <View>
                    <Button title='뒤로가기' onPress={toggle} />
                </View>
            ) : showLibrarys ? (
                <View style = {{flex: 1}}>
                    <View style = {{flexDirection: 'row', justifyContent: 'center', margin: 5, marginBottom: 10}}>
                    <Text style = {{fontSize: 30}}>도서 소장 도서관 목록</Text>
                    </View>
                    <FlatList
                        data={libdata}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.libCode}
                        style = {styles.list}
                    />
                    <View style = {{flexDirection: 'row', margin: 10, height: 45, justifyContent: 'space-evenly'}}>
                        <Button title='뒤로' onPress={redata}/>
                        <Button title='지도' onPress={libMap}/>
                    </View>
                </View>
            ) : (
                <>
                    <View style={styles.titleView}>
                        <Text style={{ fontSize: 20 }}>
                            {data[0]?.title || 'No Title'}
                        </Text>
                    </View>
                    <View style={styles.textView}>
                        <Text style={{ fontSize: 15 }}>
                            {data[0]?.writer || 'No Writer'}
                        </Text>
                    </View>
                    <View style={styles.textView}>
                        <Text style={{ fontSize: 15 }}>
                            { `출판사: ${data[0]?.publisher}` || 'No Publisher'}
                        </Text>
                    </View>
                    <View style={styles.classificationView}>
                        <Text>
                            {data[0]?.class || 'No Classification'}
                        </Text>
                    </View>
                    <View style={styles.bookIntroduction}>
                        <ScrollView>
                            <Text>
                                {data[0]?.description || 'No Description'}
                            </Text>
                        </ScrollView>
                    </View>
                    <View style={{ alignItems: 'center', marginTop: 5 }}>
                        <View style={styles.btnStatus}>
                            <TouchableOpacity>
                                <View style={{ margin: 5 }}>
                                    <Text>
                                        서제에 담긴 수
                                    </Text>
                                </View>
                            </TouchableOpacity >
                            <View style={[styles.divider]} />
                            <TouchableOpacity onPress={toggle}>
                                <View style={{ margin: 5 }}>
                                    <Text>
                                        키워드 확인
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                        <TouchableOpacity onPress={librarys}>
                            <View style={styles.btnStatus}>
                                <Text style={{ textAlign: 'center', margin: 5, }}>
                                    도서 소장 도서관 검색
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </>
            )}
        </View>
    );
}
