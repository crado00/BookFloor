import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Button, Text , Image, TouchableOpacity, TextInput, Dimensions} from 'react-native';
import { retrieveUserData } from './rogin/auth'
import { FlatList } from 'react-native-gesture-handler';
import { launchImageLibrary } from 'react-native-image-picker';
import { useNavigation } from '@react-navigation/native';

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
    const [imageUri, setImageUri] = useState<string | null>(null);

      useEffect(() => {
        const fetchData = async () => {
          const data = await retrieveUserData();
          setName(data.userId);
        };
    
        fetchData();
      }, []);

    const btn = () => {
        
    }
    const imgChange = (setImageUri: React.Dispatch<React.SetStateAction<{ uri: string } | null>>) => {
        launchImageLibrary({
            mediaType: 'photo'
        }, (response) => {
          if (response.didCancel) {
            console.log('User cancelled image picker');
          } else if (response.errorMessage) {
            console.log('ImagePicker Error: ', response.errorMessage);
          } else if (response.assets && response.assets.length > 0) {
            const uri = response.assets[0].uri || ''; // undefined인 경우 빈 문자열로 대체
            const source = { uri };
            setImageUri(source);
          }
        });
      };
    const libraryData = [
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
    ];

    const renderItem = ({item}: {item: library}) => (
        <TouchableOpacity style = {{margin: 10, borderWidth: 2, borderColor: 'black',}}>
            <View>
                <Text>{item.libName}</Text>
                <Text>{item.closed} {item.operatingTime}</Text>
                <Text>{item.address}</Text>
            </View>
        </TouchableOpacity>
    )
    const map = () =>{
        navigation.navigate('libsel', {data: libraryData});
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
                    <Text>닉네임을 입력해주세요</Text>
                    <Text>0/20</Text>
                </View>
            </View>
            <View style = {{flexDirection: "row"}}>
                <View style = {{flex:1, marginLeft:20, marginRight: 20,borderWidth: 2,borderColor: 'black',}}>
                    <TextInput placeholder = {name} />
                </View>
            </View>
            
            <View style = { { flex:1, width: screenWidth - 40, marginTop:20} }>
                <View style = { { flexDirection: 'row',} }>
                    <View style = {{flex: 1, borderWidth: 2, borderColor: 'black',}}>
                        <TextInput placeholder = '주요 방문 도서관'/>                        
                    </View>
                    <Button title='검색'/>
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
    }
)