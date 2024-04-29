import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, StackNavigationOptions } from '@react-navigation/stack';
import { CommonType } from './types';
import SignIn from './screen/SignIn';
import SignUp from './screen/SignUp';
import MyPage from './screen/MyPage';
import { useNavigation  } from '@react-navigation/native';


const StackNavigation = () => {// 스택 내비게이션을 설정하는 컴포넌트
    
    
    const Stack = createStackNavigator<CommonType.RootStackPageList>();

    // 스택 네비게이션의 사용자 정의 옵션 정의
    const customStackNavigationOptions: StackNavigationOptions = {
        gestureEnabled: false,
        title: '',
        headerStyle: {
            backgroundColor: '#209bec',
        },  
        headerTintColor: '#fff',
        headerTitleStyle: {
            fontWeight: 'bold',
        }
    }
    // 스택 네비게이터에 각 스크린을 저장
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName={"SignIn"} screenOptions={customStackNavigationOptions}>
                <Stack.Screen name='SignIn' component={SignIn} options={{ headerShown: false }}>
                </Stack.Screen>
                <Stack.Screen name='SignUp'component={SignUp} options={{ headerShown: false }}>
                </Stack.Screen>
                <Stack.Screen name='MyPage' component = {MyPage} options = {{headerShown: false }}/>
            </Stack.Navigator>
        </NavigationContainer >
    )
} 


export default StackNavigation;
