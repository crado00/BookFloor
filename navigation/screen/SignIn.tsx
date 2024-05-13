import React, { useState } from 'react';
import {
  Button,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  View,
  Alert,
  ToastAndroid,
} from 'react-native';

import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';

import { useNavigation  } from '@react-navigation/native';

import { storeUserData, retrieveUserData } from './rogin/auth'

function SignIn(): React.JSX.Element {
    const isDarkMode = useColorScheme() === 'dark';
  
    const backgroundStyle = {
      flex: 1,
      backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    };
    
    const navigation = useNavigation();
  
    const [id, setId] = useState<string>('');
    const [pw, setPw] = useState<string>('');
  
    const idChange = (inputId: string) => {
      setId(inputId);
    };
    const pwChange = (inputPw: string) => {
      setPw(inputPw);
    };
    const signUp = () => {
        /* TypeScript에 속성이 없음*/
        navigation.navigate('SignUp');//오류가 뜨지만 작동이 되는 상태
    };
    
    const signIn =() => {//마이페이지 확인용으로 잠깐만 사용
      /*const response = fetch('http://example.com/api/login', {// 변경 필요
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id, pw })
      }).then((response) => response.json())
      .then((responseJson) => {
          console.log(responseJson);
          if (responseJson.status === 'success') {// 변경 필요 토큰을 가져와야함
              storeUserData(responseJson.token, id);
              navigation.navigate('MyPage');
            }
      })
      .catch((error) => {
          console.error(error);
      });*/
      navigation.navigate('pageGruep');
    }
    const kakaoSignIn = () => {
      
    };
  
    const styles = StyleSheet.create({
      row: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 20,
      },
      titles: {
        textAlign: 'center',
        fontSize: 40,
        marginBottom: 50,
      },
      textViews: {
        paddingHorizontal: 10,
        flex: 0.3, 
      },
      texts: {
        fontSize: 16,
      },
      textInputsContainer: {
        flex: 1, 
      },
      idInputs: {
        borderWidth: 1,
        borderColor: 'gray',
      },
      pwInputs: {
        borderWidth: 1,
        borderColor: 'gray',
      },
      buttenView: {
        marginTop:10,
        paddingLeft: 20,
        paddingRight: 20
      },
      linkView: {
        marginTop:20,
        marginBottom: 40,
        justifyContent: 'center',
        alignItems: 'center',
      },
      link: {
        textDecorationLine: 'underline',
        color: 'blue',
        fontSize: 16,
      },
      onclickEventView: {
        marginTop : 50,
        justifyContent: 'flex-end'
      }
    });
  
    return (
      <SafeAreaView style={backgroundStyle}>
        <Text style={styles.titles}>책마루</Text>
        <View style={styles.row}>
          <View style={styles.textViews}>
            <Text style={styles.texts}>이메일</Text>
          </View>
          <View style={styles.textInputsContainer}>
            <TextInput placeholder="이메일을 입력하세요." onChangeText={idChange} style={styles.idInputs} value={id} ></TextInput>
          </View>
        </View>
  
        <View style={styles.row}>
          <View style={styles.textViews}>
            <Text style={styles.texts}>비밀번호</Text>
          </View>
          <View style={styles.textInputsContainer}>
            <TextInput placeholder="비밀번호를 입력하세요." onChangeText={pwChange} style={styles.pwInputs} value={pw}></TextInput>
          </View>
        </View>
  
        <View style = {styles.onclickEventView}>
          <View style = {styles.buttenView}>
            <Button title='로그인'onPress={signIn}></Button>
          </View>
  
          <View style = {styles.buttenView}>
            <Button title='카카오톡 로그인' onPress={kakaoSignIn}></Button>
          </View>
  
          <View style={styles.linkView}>
            <TouchableOpacity onPress={signUp}>
              <Text style={styles.link}>회원가입</Text>
            </TouchableOpacity>
          </View>
        </View>
  
      </SafeAreaView>
    );
  }
  
  
  
  export default SignIn;
  