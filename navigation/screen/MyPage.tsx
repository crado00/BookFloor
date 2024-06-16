import React, { useState , useEffect } from 'react';
import { View, StyleSheet, Button, Text , Image, TouchableOpacity} from 'react-native';
import TabViewExample from './myPageTab/tabNavigation';
import { useNavigation  } from '@react-navigation/native';
import { retrieveUserData } from './rogin/auth'
import MyStudy from './myStudy';
import axios from 'axios';

const MyPage = () =>{

  const [Name, setName] = useState<string>('유저이름');
  const [imgUrl, setImgUrl] =useState<string>();

  useEffect(() => {
    const fetchData = async () => {
      const data = await retrieveUserData();
      setImgUrl(`http://10.0.2.2:3001/uploads/${data.profileImage}`)
      setName(data.username);
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

  const handleLogout = async () => {
    try {
      await axios.post('http://10.0.2.2:3001/api/logout');
      navigation.navigate('SignIn');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await axios.post('http://10.0.2.2:3001/api/delete-account', {
        username: Name,
      });
      navigation.navigate('SignIn');
    } catch (error) {
      console.error('Account deletion failed', error);
    }
  };
    return(
    <View style = {styles.container}>
        <Text style = {styles.titles}>프로필</Text>
      <View style = {styles.profile}>
        <View style = {styles.circle}>
          <Image 
          style = {styles.image}
          source={ { uri: imgUrl } }
          />
        </View>
        <View style = {styles.profile2}>
          <View>
            <Text style = {styles.userName}>{Name}</Text>
          </View>
          <View style = {styles.profile3}>
              <Button title='프로필 변경'onPress={pfcp}/>
          </View>
        </View>
        
      </View>
      
      <View style = {{height: 10 ,backgroundColor: 'white_gray'}}/>
      <MyStudy/>
      <View style={styles.buttonContainer}>
        <Button title="로그아웃" onPress={handleLogout} />
        <Button title="회원탈퇴" onPress={handleDeleteAccount} />
      </View>
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
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginTop: 20,
    },
    
  });

export default MyPage;