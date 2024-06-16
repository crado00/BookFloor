import React, { useState } from 'react';
import {
  Button,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  View,
  ToastAndroid,
} from 'react-native';
import { RadioButton } from 'react-native-paper';

import { Colors } from 'react-native/Libraries/NewAppScreen';
import { useNavigation } from '@react-navigation/native';

const SignUp = ({}) => {
  const isDarkMode = useColorScheme() === 'dark';
  const serverAddress = 'http://10.0.2.2:3001/api';

  const backgroundStyle = {
    flex: 1,
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const navigation = useNavigation();

  const styles = StyleSheet.create({
    row: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
      paddingHorizontal: 20,
      marginBottom: 20,
    },
    textViews: {
      paddingHorizontal: 10,
      flex: 0.25,
    },
    texts: {
      fontSize: 16,
    },
    textInputsContainer: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
      flex: 1,
    },
    Inputs: {
      borderWidth: 1,
      borderColor: 'gray',
      width: 200,
      height: 40,
    },
    titles: {
      textAlign: 'center',
      fontSize: 40,
      marginBottom: 50,
    },
  });

  const [duplicate, setDuplicate] = useState(false);
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');
  const [pwCheck, setPwCheck] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [gender, setGender] = useState('');

  const idChange = (input) => {
    setDuplicate(false);
    setId(input);
  };

  const checkIdDuplicate = async () => {
    try {
      console.log('Checking ID duplicate...');
      const response = await fetch(`${serverAddress}/check-username`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: id }),
      });
      const responseJson = await response.json();
      if (response.ok) {
        setDuplicate(false);
        ToastAndroid.show('사용 가능한 아이디입니다.', ToastAndroid.SHORT);
      } else {
        setDuplicate(true);
        ToastAndroid.show(responseJson.message, ToastAndroid.SHORT);
      }
    } catch (error) {
      console.error('ID Duplicate Check Error:', error);
      ToastAndroid.show('아이디 중복 확인 중 오류가 발생했습니다.', ToastAndroid.SHORT);
    }
  };

  const signUp = async () => {
    if (pw !== pwCheck) {
      ToastAndroid.show('비밀번호가 일치하지 않습니다.', ToastAndroid.SHORT);
      return;
    }
    if (duplicate) {
      ToastAndroid.show('아이디가 중복되었습니다.', ToastAndroid.SHORT);
      return;
    }

    try {
      console.log('Signing up...');
      const response = await fetch(`${serverAddress}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: id,
          password: pw,
          name,
          email,
          birth_date: birthDate,
          gender,
        }),
      });
      const responseJson = await response.json();
      if (response.ok) {
        ToastAndroid.show('회원가입 성공!', ToastAndroid.SHORT);
        navigation.navigate('profileMake', {id: id, name: name});
      } else {
        ToastAndroid.show(responseJson.message, ToastAndroid.SHORT);
      }
    } catch (error) {
      console.error('Sign Up Error:', error);
      ToastAndroid.show('회원가입 중 오류가 발생했습니다.', ToastAndroid.SHORT);
    }
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <Text style={styles.titles}>책마루</Text>
      <View style={styles.row}>
        <View style={styles.textViews}>
          <Text style={styles.texts}>아이디</Text>
        </View>
        <View style={styles.textInputsContainer}>
          <TextInput
            placeholder="아이디를 입력하세요."
            style={styles.Inputs}
            onChangeText={idChange}
            value={id}
          />
          <Button title="중복 확인" onPress={checkIdDuplicate} />
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.textViews}>
          <Text style={styles.texts}>비밀번호</Text>
        </View>
        <View style={styles.textInputsContainer}>
          <TextInput
            placeholder="비밀번호를 입력하세요."
            style={styles.Inputs}
            secureTextEntry
            onChangeText={setPw}
            value={pw}
          />
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.textViews}>
          <Text style={styles.texts}>비밀번호 확인</Text>
        </View>
        <View style={styles.textInputsContainer}>
          <TextInput
            placeholder="비밀번호 확인"
            style={styles.Inputs}
            secureTextEntry
            onChangeText={setPwCheck}
            value={pwCheck}
          />
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.textViews}>
          <Text style={styles.texts}>이름</Text>
        </View>
        <View style={styles.textInputsContainer}>
          <TextInput
            placeholder="이름을 입력하세요."
            style={styles.Inputs}
            onChangeText={setName}
            value={name}
          />
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.textViews}>
          <Text style={styles.texts}>이메일주소</Text>
        </View>
        <View style={styles.textInputsContainer}>
          <TextInput
            placeholder="이메일주소를 입력하세요."
            style={styles.Inputs}
            onChangeText={setEmail}
            value={email}
          />
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.textViews}>
          <Text style={styles.texts}>생년월일</Text>
        </View>
        <View style={styles.textInputsContainer}>
          <TextInput
            placeholder="생년월일을 입력하세요."
            style={styles.Inputs}
            onChangeText={setBirthDate}
            value={birthDate}
          />
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.textViews}>
          <Text style={styles.texts}>성별</Text>
        </View>
        <View style={styles.textInputsContainer}>
          <RadioButton
            value="male"
            status={gender === 'male' ? 'checked' : 'unchecked'}
            onPress={() => setGender('male')}
          />
          <Text>남성</Text>
          <RadioButton
            value="female"
            status={gender === 'female' ? 'checked' : 'unchecked'}
            onPress={() => setGender('female')}
          />
          <Text>여성</Text>
        </View>
      </View>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-evenly',
          alignItems: 'center',
        }}>
        <Button title="가입하기" onPress={signUp} />
        <Button title="가입취소" onPress={() => navigation.goBack()} />
      </View>
    </SafeAreaView>
  );
};

export default SignUp;
