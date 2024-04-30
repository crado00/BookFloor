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

const SignUp = ({}) => {
    const isDarkMode = useColorScheme() === 'dark';
  
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
            height: 40
          },
          titles: {
            textAlign: 'center',
            fontSize: 40,
            marginBottom: 50,
          }
    })

    const [duplicate, setduplicate] = useState<boolean>(false);
    const [id, setId] = useState<string>('');
    const [pw, setPw] = useState<string>('');
    const [pwChack, setpwChack] = useState<string>('');
    const [name, setName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    //const [birthDate, setbirthDate] = useState<Date>(); 생년월일 변경준비
    const [birthDate, setbirthDate] = useState<string>('19990430');
    
    const idChange = (input: string) => {
        setduplicate(false);
        setId(input);
    }
    const pwChange = (input: string) => {
        setPw(input);
    }
    const pwChackChange = (input: string) => {
        setpwChack(input);
    }
    const nameChange = (input: string) => {
        setName(input);
    }
    const emailChange = (input: string) => {
        setEmail(input);
    }
    //const birthDateChange = (input: Date) => { 생년월일 변경준비
        const birthDateChange = (input: string) => {
        setbirthDate(input);
    }


    const duplicateButton = () => {
        if(true){
            setduplicate(true);// 중복확인을 위한 코드
            ToastAndroid.show('사용가능한 아이디입니다.', ToastAndroid.SHORT);
        } else{
            ToastAndroid.show('중복된 아이디입니다.', ToastAndroid.SHORT);
        }
    }
    const signUpButton = () => {
        if (id !== '' ){
            if (duplicate === true){
                if (pw !==''){
                    if (pw === pwChack){
                        if(name !== ''){
                            if(email !== ''){
                                if (birthDate !== null){
                                    //서버로 사용자 정보 전달

                                

                                    navigation.goBack();
                                }else{
                                    ToastAndroid.show('사용자 정보를 입력해주세요.', ToastAndroid.SHORT);
                                }
                            }else{
                                ToastAndroid.show('사용자 정보를 입력해주세요.', ToastAndroid.SHORT);
                            }
                        }else{
                            ToastAndroid.show('사용자 정보를 입력해주세요.', ToastAndroid.SHORT);
                        }
                    }else{
                        ToastAndroid.show('비밀번호가 일치하지 않습니다.', ToastAndroid.SHORT);
                    }
                }else{
                    ToastAndroid.show('사용자 정보를 입력해주세요.', ToastAndroid.SHORT);
                }
            }else{
                ToastAndroid.show('아이디 중복 확인을 해주세요.', ToastAndroid.SHORT);
            }
        }else{
            ToastAndroid.show('사용자 정보를 입력해주세요.', ToastAndroid.SHORT);
        }
        
    }
    const cancelSubscriptionButton = () => {
        navigation.goBack();
    } 
    return (
        <SafeAreaView style={backgroundStyle}>
            <Text style = {styles.titles}>회원가입</Text>
            <View style = {styles.row}>
                <View style = {styles.textViews}>
                    <Text style = {styles.texts}>아이디</Text>
                </View>
                <View style = {styles.textInputsContainer}>
                    <TextInput placeholder="아이디를 입력하세요." style={styles.Inputs} onChangeText={idChange} value={id}/>
                    <Button title='중복 확인' onPress={duplicateButton}/>
                </View>
            </View>

            <View style = {styles.row}>
                <View style = {styles.textViews}>
                    <Text style = {styles.texts}>비밀번호</Text>
                </View>
                <View style = {styles.textInputsContainer}>
                    <TextInput placeholder="비밀번호를 입력하세요." style={styles.Inputs} onChangeText={pwChange} value={pw}/>
                </View>
            </View>

            <View style = {styles.row}>
                <View style = {styles.textViews}>
                    <Text style = {styles.texts}>비밀번호 확인</Text>
                </View>
                <View style = {styles.textInputsContainer}>
                    <TextInput placeholder="비밀번호 확인" style={styles.Inputs} onChangeText={pwChackChange} value={pwChack}/>
                </View>
            </View>

            <View style = {styles.row}>
                <View style = {styles.textViews}>
                    <Text style = {styles.texts}>이름</Text>
                </View>
                <View style = {styles.textInputsContainer}>
                    <TextInput placeholder="이름을 입력하세요." style={styles.Inputs} onChangeText={nameChange} value={name}/>
                </View>
            </View>

            <View style = {styles.row}>
                <View style = {styles.textViews}>
                    <Text style = {styles.texts}>이메일주소</Text>
                </View>
                <View style = {styles.textInputsContainer}>
                    <TextInput placeholder="이메일주소를 입력하세요." style={styles.Inputs}  onChangeText={emailChange} value={email}/>
                </View>
            </View>

            <View style = {styles.row}>
                <View style = {styles.textViews}>
                    <Text style = {styles.texts}>생년월일</Text>
                </View>
                <View style = {styles.textInputsContainer}>
                    <TextInput placeholder="생년월일을 입력하세요." style={styles.Inputs} onChangeText={birthDateChange} value={birthDate}/>
                </View>
            </View>
            <View style = {{flexDirection: 'row',
                            justifyContent: 'space-evenly',
                            alignItems: 'center',}}>
                <Button title='가입하기' onPress={signUpButton}/>
                <Button title='가입취소' onPress={cancelSubscriptionButton}/>
            </View>
            

        </SafeAreaView>
      );

}
export default SignUp;