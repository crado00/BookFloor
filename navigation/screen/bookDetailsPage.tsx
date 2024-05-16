import React, { useState , useEffect } from 'react';
import { View, StyleSheet, Button, Text , Image, TouchableOpacity, FlatList, Dimensions} from 'react-native';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import { storeUserData, retrieveUserData } from './rogin/auth'
import { useNavigation  } from '@react-navigation/native';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;



export default function(){
    const [showView, setShowView] = useState(false);

    const toggle = () => {
        setShowView(!showView);
    };

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
            flex: 1
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
            height: 20
          },
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
            {showView ? ( // 키워드 버튼 클릭 시 이 뷰로 변경
                <View>
                    <Button title='뒤로가기' onPress={toggle}/>
                </View>
            ) : ( <>
            <View style = {styles.titleView}>
                <Text style = {{fontSize: 20}}>
                    {data[0].title}
                </Text>
            </View>
            <View style = {styles.textView}>
                <Text style = {{fontSize: 15}}>
                    {data[0].writer}
                </Text>
            </View>
            <View style = {styles.textView}>
                <Text style = {{fontSize: 15}}>
                    {data[0].publisher}
                </Text>
            </View>
            <View style = {styles.classificationView}>
                <Text>
                    [문학 {'>'} 한국문학 {'>'} 소설]
                </Text>
            </View>
            <View style = {styles.bookIntroduction}>
                <ScrollView>
                    <Text>
                        70만 독자를 사로잡은 재미와 감동『불편한 편의점』이 다시 열렸다!한층 진득해진 이야기와 궁금증 가득한 캐릭터고난의 시간을 통과하는 사람들이 다시 편의점에 모여든다!재방문을 환영합니다. 여기는 청파동 ALWAYS편의점입니다.독고가 떠나고 1년 반이 지난 여름, 청파동 ALWAYS편의점에 새 야간 알바가...
                    </Text>
                </ScrollView>
            </View>
            <View style = {{alignItems: 'center', marginTop: 5}}>
                <View style = {styles.btnStatus}>
                    <TouchableOpacity>
                        <View style = {{margin: 5}}>
                            <Text>
                                서제에 담긴 수
                            </Text>
                        </View>
                    </TouchableOpacity >
                    <View style={[styles.divider]} />
                    <TouchableOpacity onPress={toggle}>
                        <View style = {{margin: 5}}>
                            <Text>
                                키워드 확인
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
                
            </View>
            <View style = {{flexDirection: 'column', alignItems: 'center'}}>
                <TouchableOpacity>
                    <View style = {styles.btnStatus}>
                        <Text style = {{textAlign: 'center', margin: 5}}>
                            도서 소장 도서관 검색
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
            
            </>
            )}
        </View>
    )
}