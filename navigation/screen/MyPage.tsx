import React, { useState , useEffect } from 'react';
import { View, StyleSheet, Button, Text , Image, TouchableOpacity} from 'react-native';
import TabViewExample from './myPageTab/tabNavigation';
import { useNavigation  } from '@react-navigation/native';
import { retrieveUserData } from './rogin/auth'

const MyPage = () =>{

  const [Name, setName] = useState<string>('유저이름');

  useEffect(() => {
    const fetchData = async () => {
      const data = await retrieveUserData();
      setName(data.userId);
    };

    fetchData();
  }, []);

  const navigation = useNavigation();

  const pfcp = () =>{
    navigation.navigate('profileChange')
  }
  const myStudy = () =>{
    navigation.navigate('myStudy')
  }
    return(
    <View style = {styles.container}>
        <Text style = {styles.titles}>프로필</Text>
      <View style = {styles.profile}>
        <View style = {styles.circle}>
          <Image 
          style = {styles.image}
          source={ { uri: 'https://gongu.copyright.or.kr/gongu/wrt/cmmn/wrtFileImageView.do?wrtSn=9046601&filePath=L2Rpc2sxL25ld2RhdGEvMjAxNC8yMS9DTFM2L2FzYWRhbFBob3RvXzI0MTRfMjAxNDA0MTY=&thumbAt=Y&thumbSe=b_tbumb&wrtTy=10004' } }
          />
        </View>
        <View style = {styles.profile2}>
          <View>
            <Text style = {styles.userName}>{Name}</Text>
          </View>
          <View style = {styles.profile3}>
              <Button title='프로필 변경'onPress={pfcp}/>
              <Button title='내 서재' onPress={myStudy}/>
          </View>
        </View>
        
      </View>
      <View style = {styles.viewGrup}>
      <View style={[styles.divider]} />
        <View style = {styles.textView}>
          <Text style = {styles.text}>게시글/댓글</Text>
          <Text style = {styles.text}>수넣을자리</Text>
        </View>
        <View style={[styles.divider]} />
        <View style = {styles.textView}>
          <Text style = {styles.text}>받은 공감</Text>
          <Text style = {styles.text}>수넣을자리</Text>
        </View>
        <View style={[styles.divider]} />
        <View style = {styles.textView}>
          <Text style = {styles.text}>내 서재</Text>
          <Text style = {styles.text}>수넣을자리</Text>
        </View>
        <View style={[styles.divider]} />
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
    },
    userName: {
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
    textView: {
      flex: 1,
      justifyContent: 'center'
    },
    text:{
      textAlign: 'center'
    },
    element: {
      flex: 1, // 동일한 너비를 가지도록 설정
      paddingVertical: 10,
      paddingHorizontal: 20,
    },
    divider: {
      borderLeftWidth: 1,
      borderLeftColor: 'black'
    },
    viewGrup: {
      justifyContent: 'space-evenly',
      flexDirection: 'row',
      marginLeft: 20,
      marginRight: 20
    }
    
  });

export default MyPage;