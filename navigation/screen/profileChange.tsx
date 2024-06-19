import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Button, Text , Image, TouchableOpacity, TextInput, Dimensions, ToastAndroid} from 'react-native';
import { retrieveUserData, updateUserData } from './rogin/auth'
import { FlatList } from 'react-native-gesture-handler';
import { launchImageLibrary } from 'react-native-image-picker';
import { useNavigation, useRoute } from '@react-navigation/native';
import Geolocation from "react-native-geolocation-service"
import {
    request,
    PERMISSIONS,
    requestLocationAccuracy,
    requestMultiple,
  } from 'react-native-permissions';
import axios from 'axios';
interface library{
    libCode: string,
    libName: string,
    tel: string,
    closed: string,
    operatingTime: string,
    address: string,
    latitude: number,
    longitude: number
}

export default function profileChange(){
    const navigation = useNavigation();
    const [name, setName] = useState('유저이름');
    const screenWidth = Dimensions.get('window').width;
    const [imageUri, setImageUri] = useState<string>();
    const [searchlib, setSearchlib] = useState<string>();
    const [id, setId] = useState({});
    const [libraryData, setLibraryData] =useState([]);
    const [chack, setChack] = useState('');//라이브러리 코드가 저장됨

    const route = useRoute();

      useEffect(() => {
        const fetchData = async () => {
          const data = await retrieveUserData();
          setId(data.userId)
          setName(data.username);
        };
    
        fetchData();
      }, []);
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
                  const {latitude, longitude} = positon.coords
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
              
              const setlib = async (lat: number, long: number) =>{
                const url = `http://172.16.38.97:3001/library/libraries/${lat}/${long}/0.05/0.05`//연결 코드 추가
            
                    console.log('전송시작')
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
                  }
                  }catch(e){
                      console.log(e)
                  }
                }
              
    },[])

    useEffect(() => {
      console.log("내용확인")

      if (route.params?.libcode) {
        setChack(route.params.libcode)
      }
    }, [route.params?.libcode]);

    const btn = async () => {
        const url = `http://172.16.38.97:3001/api/update-profile`
        const formData = new FormData();
        formData.append('profileImage', {
          uri: imageUri,
          type: 'image/jpeg', // 또는 다른 이미지 유형
          name: 'image.jpg', // 파일 이름
        });
        formData.append('name', name);
        formData.append('userId', id);
        formData.append('libCode', chack);
        try {
          const response = await axios.post(url, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          })
          updateUserData({username: response.data.name})
          updateUserData({libCode: response.data.libCode})
          updateUserData({profileImage: response.data.imageurl})
          navigation.goBack()
        } catch (error) {
          console.log(error)
        }
    }

    const libsearch = async () => {
      const url = `http://172.16.38.97:3001/library/search`
        console.log(searchlib !== '')

            if(searchlib !== ''){                
                try{
                  console.log('확인')
                    const response = await axios.post(url,
                        {
                            name: searchlib,
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
            console.log(uri)
            setImageUri(uri);
          }
        });
      };

    const renderItem = ({item}: {item: library}) => {

      const chacklib = () =>{
          setChack(item.libCode);
      }

      return(
      <TouchableOpacity onPress={chacklib}>
          <View style={[styles.libList, chack===item.libCode && styles.selected]}>
              <Text>{item.libName}</Text>
              <Text numberOfLines={1} ellipsizeMode="tail" >휴관일: {item.closed}</Text>
              <Text>운영시간: {item.operatingTime}</Text>
              <Text>주소: {item.address}</Text>
          </View>
      </TouchableOpacity>
      )
  };
    const map = () =>{
        navigation.navigate('MapPage', {data: libraryData});
    }
    return (
        <View style = {styles.container}>
            <TouchableOpacity style = {{margin: 30}} onPress={imgChange}>
                <View style = {styles.circle}>
                    <Image style = {styles.image} source={{uri: imageUri}}/>
                </View>
            </TouchableOpacity>
            <View style = {{flexDirection: "row"}}>
                <View style = {{flex: 1, flexDirection: "row", justifyContent: 'space-between', marginLeft: 20, marginRight: 20}}>
                    <Text>이름을 입력해주세요</Text>
                    <Text>0/20</Text>
                </View>
            </View>
            <View style = {{flexDirection: "row"}}>
                <View style = {{flex:1, marginLeft:20, marginRight: 20,borderWidth: 2,borderColor: 'black',}}>
                    <TextInput placeholder = 'user name' value={name} onChangeText={setName}/>
                </View>
            </View>
            
            <View style = { { flex:1, width: screenWidth - 40, marginTop:20, backgroundColor: '#FAFAD2'} }>
                <View style = { { flexDirection: 'row',} }>
                    <View style = {{flex: 1, borderWidth: 2, borderColor: 'black',}}>
                        <TextInput placeholder = '주요 방문 도서관' value= {searchlib} onChangeText={setSearchlib}/>                        
                    </View>
                    <Button title='검색' onPress={libsearch}/>
                    <Button title='지도' onPress={map}/>
                </View >
                <FlatList
                    data={libraryData}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.libCode}
                    style = {{borderWidth: 2, borderColor: 'black',}}
                />
            </View>

            <View style = {{flexDirection: "row"}}>
                <View style = {{flex:1, margin:20,}}>
                    <Button title='저장' onPress={btn}/>
                </View>
            </View>
        </View>
    )
} 

const styles = StyleSheet.create(
    {
        container: {
            flex: 1,
            alignItems: 'center',
            backgroundColor: 'white',
          },
          circle: {
            width: 150,
            height: 150,
            borderRadius: 75,
            overflow: 'hidden', // 이미지가 원 밖으로 벗어나지 않도록 설정합니다.
            borderWidth: 2,
            borderColor: 'black',
          },
          image: {
            width: '100%', // 원 안에 이미지가 가득 차도록 설정합니다.
            height: '100%',
          },
          selected: {
            backgroundColor: '#cfc', // 선택된 항목의 배경색
        },
        libList: {
          backgroundColor: 'white',
          margin: 5
      },
    }
)