import React, { useState , useEffect } from 'react';
import { View, StyleSheet, Button, Text , Image, TouchableOpacity, FlatList, Dimensions, ToastAndroid } from 'react-native';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import { updateUserData, retrieveUserData} from './rogin/auth'
import { useNavigation, useRoute } from '@react-navigation/native';
import { launchImageLibrary } from 'react-native-image-picker';
import Geolocation from "react-native-geolocation-service"
import {
    request,
    PERMISSIONS,
    requestLocationAccuracy,
    requestMultiple,
  } from 'react-native-permissions';
import axios from 'axios';

interface btn {
    btnId: string,
    btnName: string
}

interface library {
    libCode: string,
    libName: string,
    tel: string,
    closed: string,
    operatingTime: string,
    address: string,
    latitude: number,
    longitude: number
}

interface StateType {
    [key: string]: boolean;
}
const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
    titleView: {},
    imgView: {
        margin: 10,
        width: 150,
        height: 150,
        borderRadius: 75,
        overflow: 'hidden', // 이미지가 원 밖으로 벗어나지 않도록 설정합니다.
        borderWidth: 2,
        borderColor: 'black',
    },
    textInputView: {
        flexDirection: 'row',
        marginBottom: 10
    },
    textView: {
        margin: 10,
        width: screenWidth - 20,
    },
    scroloView: {
        marginTop: 20,
        width: screenWidth - 40,
        height: 150,
        borderWidth: 2,
        borderColor: 'black',
    },
    btnView: {
        margin: 5,
        width: 80,
        height: 30,
        borderRadius: 10,
        overflow: 'hidden', // 이미지가 원 밖으로 벗어나지 않도록 설정합니다.
        borderWidth: 2,
        borderColor: 'black',
    },
    activeButton: {
        backgroundColor: 'green',
    },
    button: {
        backgroundColor: 'gray',
        width: '100%',
        height: '100%',
        overflow: 'hidden'
    },
    nextOrBack: {
        justifyContent: 'space-evenly', 
        flexDirection: 'row', 
        position: 'absolute', 
        bottom: 0, 
        width: 200,
        height: 40,
        marginBottom: 10,
    },
    libList: {
        backgroundColor: 'white',
        margin: 5
    },
    libContainer: {
        backgroundColor: 'gray',
        margin: 10,
        height: 400,
        width: screenWidth - 40,
    },
    searchView: {
        flexDirection: 'row',
        marginRight: 10,
        marginLeft: 10,
        marginBottom: 10
    },
    selected: {
        backgroundColor: '#cfc', // 선택된 항목의 배경색
    },
});



export default function() {
    const navigation = useNavigation();
    const route = useRoute()
    const [imageUri, setImageUri] = useState<string>('');
    const [searchdata, setSearchData] =useState<string>("");
    const [libraryData, setLibraryData] = useState([])
    const [chack, setChack] = useState('');//라이브러리 코드가 저장됨
    useEffect(() =>{
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
                  const {latitude, longitude } = positon.coords
                    setlib(latitude, longitude);

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

              
    },[])
    useEffect(() => {
        console.log("내용확인")
  
        if (route.params?.libcode) {
          setChack(route.params.libcode)
        }
      }, [route.params?.libcode]);

      
    const setlib = async (lat: number, long: number) =>{
    const url = `http://10.0.2.2:3001/library/libraries/${lat}/${long}/0.05/0.05`//연결 코드 추가

      try{
      const response = await axios.get(url)
      const obj = response.data
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
          setLibraryData(newData)
          navigation.navigate('SignIn');
      }
      }catch(e){
          console.log(e)
      }
    }
    const backbtn = () => {
        navigation.goBack()
    }
    
    const imgChange = () => {
        launchImageLibrary({
            mediaType: 'photo'
        }, (response) => {
          if (response.didCancel) {
            console.log('User cancelled image picker');
          } else if (response.errorMessage) {
            console.log('ImagePicker Error: ', response.errorMessage);
          } else if (response.assets && response.assets.length > 0) {
            const uri = response.assets[0].uri || ''; // undefined인 경우 빈 문자열로 대체
            setImageUri(uri);
          }
        });
      };

      
    const complete = async () => {
        const url = `http://10.0.2.2:3001/api/update-profile`
        const formData = new FormData();
        formData.append('profileImage', {
          uri: imageUri,
          type: 'image/jpeg', // 또는 다른 이미지 유형
          name: 'image.jpg', // 파일 이름
        });
        formData.append('name', route.params?.name);
        formData.append('userId', route.params?.id);
        formData.append('libCode', chack);
        try {
          const response = await axios.post(url, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          })
        navigation.navigate('pageGruep');
        } catch (error) {
          console.log(error)
        }
        // 저장 부분
    }
    const maplib = () => {
        navigation.navigate('mapPage', {data: libraryData});
    }
    const search = async () => {
        //도서관 이름 검색
        const url = `http://192.168.219.104:3001/library/search`
        console.log(searchdata !== '')

            if(searchdata !== ''){                
                try{
                  console.log('확인')
                    const response = await axios.post(url,
                        {
                            name: searchdata,
                            filters: {
                                date: '2024-06-14'
                            }
                        }
                    )
                    const obj = response.data;
                    console.log(obj)
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
                          setLibraryData(newData)
                    }
                  }catch(e){

                    console.log(e)
                  }

            }else{
                ToastAndroid.show('도서관 이름을 입력해 주세요.', ToastAndroid.SHORT);
            }
    }

    
    const lib = ({ item }: { item: library }) => {

        const chacklib = () =>{
            setChack(item.libCode);
        }

        return(
        <TouchableOpacity onPress={chacklib}>
            <View style={[styles.libList, chack===item.libCode && styles.selected]}>
                <Text>{item.libName}</Text>
                <Text numberOfLines={1} ellipsizeMode="tail" >휴관일: {item.closed}</Text>
                <Text numberOfLines={1} ellipsizeMode="tail" >운영시간: {item.operatingTime}</Text>
                <Text>주소: {item.address}</Text>
            </View>
        </TouchableOpacity>
        )
    };

    return (
        <View style={{ flex: 1, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center' }}>
            <View style={styles.titleView}>
                <Text style={{ fontSize: 50, margin: 10, }}>
                    책마루
                </Text>
            </View>

            <TouchableOpacity onPress={imgChange}>
                <View style={styles.imgView}>
                    <Image source={{ uri: imageUri }} style={{ width: '100%', height: '100%' }} />
                </View>
            </TouchableOpacity>
            
            
            <View style={{ flex: 1, backgroundColor: '#E1FFFF', width: screenWidth, alignItems: 'center' }}>
                
                <View style={styles.libContainer}>
                    <Text style={{ fontSize: 30, color: 'white', margin: 10 }}>도서관 선택</Text>
                    
                    <View style ={styles.searchView}>
                        <TextInput placeholder='도서관 이름을 입력하세요.' style={{ borderWidth: 2, borderColor: 'black', backgroundColor: 'white', flex: 1}} value={searchdata} onChangeText={setSearchData}/>
                        <Button title='검색' onPress={search}/>
                    </View>
                    <FlatList
                        data={libraryData}
                        renderItem={lib}
                        keyExtractor={(item) => item.libCode}
                    />
                    <Button title='지도에서 찾기' onPress={maplib}/>
                </View>
                <View style={styles.nextOrBack}>
                    <Button title='뒤로' onPress={backbtn} />
                    <Button title='완료' onPress={complete} />
                </View>
            </View>
        </View>
    )
}
