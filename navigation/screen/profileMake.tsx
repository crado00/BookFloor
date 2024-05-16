import React, { useState , useEffect } from 'react';
import { View, StyleSheet, Button, Text , Image, TouchableOpacity, FlatList, Dimensions} from 'react-native';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import { storeUserData, retrieveUserData } from './rogin/auth'
import { useNavigation  } from '@react-navigation/native';

interface btn{
    btnId: string,
    btnName: string
}

interface StateType {
    [key: string]:boolean;
}
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
    titleView: {

    },
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
    },
    textView: {
        margin: 10,
        width: screenWidth-20,
    },
    scroloView: {
        marginTop: 20,
        height: 250,
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
    }
})
const btn =  [
    {
        btnId: '1',
        btnName: '카테고리 1'
    },
    {
        btnId: '2',
        btnName: '카테고리 2'
    },
    {
        btnId: '3',
        btnName: '카테고리 3'
    },
    {
        btnId: '4',
        btnName: '카테고리 4'
    },
    {
        btnId: '5',
        btnName: '카테고리 5'
    },
    {
        btnId: '6',
        btnName: '카테고리 6'
    },
    {
        btnId: '7',
        btnName: '카테고리 7'
    },
    {
        btnId: '8',
        btnName: '카테고리 8'
    },
    {
        btnId: '9',
        btnName: '카테고리 9'
    },
    
];

const imgChange = () =>{
    //이미지 추가
}

const identification = () =>{
    //닉네임 중복확인
}


export default function(){
    const navigation = useNavigation();
    
    const [categoryTF, setCategoryTF] = useState<StateType>({//필요 카테고리만큼 추가해야함
        value1: false,
        value2: false,
        value3: false,
        value4: false,
        value5: false,
        value6: false,
        value7: false,
        value8: false,
        value9: false,
      });
      const toggleValue = (key: string) => {
        setCategoryTF(prevState => ({
          ...prevState,
          [key]: !prevState[key as keyof typeof categoryTF],
        }));
      };
      const renderItem = ({item}: {item: btn}) =>(    
        <View style={styles.btnView}>
            <TouchableOpacity
                onPress={() => toggleValue(`value${item.btnId}`)}
                style={[styles.button, categoryTF[`value${item.btnId}`] ? styles.activeButton : null]}
            >
                <Text style={{ textAlign: 'center' }}>
                    {item.btnName}
                </Text>
            </TouchableOpacity>
        </View>
        
    )

    const backbtn = () =>{
        navigation.goBack();
    }
    
    const complete = () =>{//저장 부분
        navigation.navigate('pageGruep');
    }

    const [viewSize, setViewSize] = useState({ width: 0, height: 0 });

    const handleLayout = (event: { nativeEvent: { layout: { width: any; height: any; }; }; }) => {
        const { width, height } = event.nativeEvent.layout;
        setViewSize({ width, height });
      };
    return(
        <View style = {{flex: 1, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center'}}>
            <View style = {styles.titleView}>
                <Text style = {{fontSize: 50, margin:10}}>
                    책마루
                </Text>
            </View>
            <TouchableOpacity onPress={imgChange}>
                <View style = {styles.imgView}>
                    <Image source={{uri: 'https://gongu.copyright.or.kr/gongu/wrt/cmmn/wrtFileImageView.do?wrtSn=9046601&filePath=L2Rpc2sxL25ld2RhdGEvMjAxNC8yMS9DTFM2L2FzYWRhbFBob3RvXzI0MTRfMjAxNDA0MTY=&thumbAt=Y&thumbSe=b_tbumb&wrtTy=10004'}} style = {{width: '100%', height: '100%'}}/>
                </View>
            </TouchableOpacity>
            
            <View style = {styles.textInputView}>
                <TextInput placeholder='닉네임을 입력하세요.' style ={{borderWidth: 2, borderColor: 'black',width: 200}}/>
                <Button title='중복확인' onPress={identification}/>
            </View>
            <View style = {{flex: 1, backgroundColor: '#E1FFFF', width: screenWidth, alignItems: 'center'}}>
                <View style = {styles.textView}>
                    <Text>
                        취향 카테고리 설정
                    </Text>
                    <Text>
                        평소 즐겨 읽는 분야의 카테고리를 선택하세요.
                    </Text>
                </View>
                <View style = {styles.scroloView}>
                    <FlatList
                        data = {btn}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.btnId}
                        numColumns={4}
                        contentContainerStyle={{ alignItems: 'center'}}
                    />
                </View>
                <View style = {styles.nextOrBack}>
                    <Button title='뒤로' onPress={backbtn}/>
                    <Button title='완료' onPress={complete}/>
                </View>
            </View>
            
        </View>
    )
    
}