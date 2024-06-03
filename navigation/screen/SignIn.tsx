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
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { useNavigation } from '@react-navigation/native';
import { storeUserData } from './rogin/auth';  // Assuming you have this utility function

function SignIn(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    flex: 1,
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };
  const navigation = useNavigation();
  const serverAddress = 'http://10.0.2.2:3001/api';

  const [id, setId] = useState<string>('');
  const [pw, setPw] = useState<string>('');

  const idChange = (inputId: string) => {
    setId(inputId);
  };
  const pwChange = (inputPw: string) => {
    setPw(inputPw);
  };
  const signUp = () => {
    navigation.navigate('SignUp');
  };

  const signIn = async () => {
    try {
      const response = await fetch(`${serverAddress}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: id, password: pw })
      });
      const responseJson = await response.json();
      if (response.ok) {
        await storeUserData(responseJson.token, id);
        navigation.navigate('mainPage');
      } else {
        Alert.alert('로그인 실패', responseJson.message);
      }
    } catch (error) {
      console.error(error);
      Alert.alert('로그인 오류', '로그인 중 오류가 발생했습니다.');
    }
  };

  const kakaoSignIn = () => {
    navigation.navigate('profileMake');
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
      marginTop: 10,
      paddingLeft: 20,
      paddingRight: 20,
    },
    linkView: {
      marginTop: 20,
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
      marginTop: 50,
      justifyContent: 'flex-end',
    },
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

      <View style={styles.onclickEventView}>
        <View style={styles.buttenView}>
          <Button title='로그인' onPress={signIn}></Button>
        </View>

        <View style={styles.buttenView}>
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
