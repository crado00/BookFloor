import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Button, Text , Image, TouchableOpacity, TextInput} from 'react-native';
import { retrieveUserData } from './rogin/auth'

export default function profileChange(){

    const [name, setName] = useState('유저이름');

    
    
      useEffect(() => {
        const fetchData = async () => {
          const data = await retrieveUserData();
          setName(data.userId);
        };
    
        fetchData();
      }, []);

    const btn = () => {
        
    }

    return (
        <View style = {styles.container}>
            <TouchableOpacity style = {{margin: 30}}>
                <View style = {styles.circle}>
                    <Image style = {styles.image}/>
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