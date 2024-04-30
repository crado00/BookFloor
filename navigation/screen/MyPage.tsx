import React, { useState } from 'react';
import { View, StyleSheet, Button, Text , Image, TouchableOpacity} from 'react-native';
import TabViewExample from './myPageTab/tabNavigation';

const MyPage = () =>{

  const [Name, setName] = useState<string>('유저이름');


    return(
    <View style = {styles.container}>
        <Text style = {styles.titles}>프로필</Text>
      <View style = {styles.profile}>
        <View style = {styles.circle}>
          <Image 
          style = {styles.image}
          />
        </View>
        <View style = {styles.profile2}>
          <View>
            <Text style = {styles.userName}>{Name}</Text>
          </View>
          <View style = {styles.profile3}>
            <View >
              <Button title='프로필 변경'/>
            </View>
            <View>
              <Button title='위치 변경'/>
            </View>
          </View>
        </View>
        
      </View>
      <View style = {{justifyContent: 'space-evenly', flexDirection: 'row'}}>
        <View style = {{justifyContent: 'center'}}>
          <Text style = {{textAlign: 'center'}}>게시글/댓글</Text>
          <Text style = {{textAlign: 'center'}}>수넣을자리</Text>
        </View>
        <View>
          <Text style = {{textAlign: 'center'}}>받은 공감</Text>
          <Text style = {{textAlign: 'center'}}>수넣을자리</Text>
        </View>
        <View>
          <Text>내 서재</Text>
          <Text>수넣을자리</Text>
        </View>
      </View>
      <View style = {{height: 10 ,backgroundColor: 'white_gray'}}/>
      <TabViewExample/>
    </View>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'column',
      backgroundColor: 'white'
    },
    titles: {
      fontSize: 40,
      textAlign: 'center',
    },
    profile: {
      flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    circle: {
      width: 100,
      height: 100,
      borderRadius: 50,
      overflow: 'hidden', // 이미지가 원 밖으로 벗어나지 않도록 설정합니다.
      borderWidth: 2,
      borderColor: 'black',
    }, userName: {
      textAlign: 'left',
      fontSize: 20,
    },
    image: {
      width: '100%', // 원 안에 이미지가 가득 차도록 설정합니다.
      height: '100%',
    },
    profile2: {
      marginStart: 20,
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
    },
    profile3: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
    },
    
  });

export default MyPage;