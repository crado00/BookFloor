import React, { useState , useEffect } from 'react';
import { View, StyleSheet, Button, Text , Image, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import { storeUserData, retrieveUserData } from './rogin/auth'
import { useNavigation  } from '@react-navigation/native';
import { launchImageLibrary } from 'react-native-image-picker';

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
        width: 100,
        height: 100,
        borderRadius: 50,
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
    }
});



const identification = () => {
    //닉네임 중복확인
}

export default function() {
    const navigation = useNavigation();
    
    const [imageUri, setImageUri] = useState<string | null>(null);
    const [searchdata, setSearchData] =useState<string>("");

    const backbtn = () => {
        navigation.goBack();
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

    const complete = () => {
        // 저장 부분
        navigation.navigate('pageGruep');
    }
    const maplib = () => {
        navigation.navigate('libsel', {data: libraryData});
    }
    const search = () => {
        //도서관 이름 검색
        
    }
    const onSearch = (input) => {
        setSearchData(input)
    }
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
        },
        {
            libCode: '2',
            libName: '도서관',
            tel: '010-2345-6789',
            closed: '휴관일',
            operatingTime: '운영시간',
            address: '주소',
            latitude: 33.38,
            longitude: 126.55,
        }
    ];
    
    const lib = ({ item }: { item: library }) => (
        <TouchableOpacity>
            <View style={styles.libList}>
                <Text>{item.libName}</Text>
                <Text>{item.closed} {item.operatingTime}</Text>
                <Text>{item.address}</Text>
            </View>
        </TouchableOpacity>
    );

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
            
            <View style={styles.textInputView}>
                <TextInput placeholder='닉네임을 입력하세요.' style={{ borderWidth: 2, borderColor: 'black', width: 200 }} />
                <Button title='중복확인' onPress={identification} />
            </View>
            <View style={{ flex: 1, backgroundColor: '#E1FFFF', width: screenWidth, alignItems: 'center' }}>
                
                <View style={styles.libContainer}>
                    <Text style={{ fontSize: 30, color: 'white', margin: 10 }}>도서관 선택</Text>
                    
                    <View style ={styles.searchView}>
                        <TextInput placeholder='도서관 이름을 입력하세요.' style={{ borderWidth: 2, borderColor: 'black', backgroundColor: 'white', flex: 1}} value={searchdata} onChangeText={onSearch}/>
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
