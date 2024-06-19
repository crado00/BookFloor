import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, StackNavigationOptions } from '@react-navigation/stack';
import { CommonType } from './types';
import SignIn from './screen/SignIn';
import SignUp from './screen/SignUp';
import profileChange from './screen/profileChange';
import ocrPage from './screen/ocrPage';
import pageGruep from './screen/pageGruep';
import searchPage from './screen/searchPage';
import bookDetailsPage from './screen/bookDetailsPage';
import profileMake from './screen/profileMake';
import myStudy from './screen/myStudy';
import libsel from './screen/libsel'
import mapPage from './screen/mapPage';
import booklibsel from './screen/booklibsel';
import ocrBookResult from './screen/ocrBookResult';
import ocrPage2 from './screen/ocrPage2';
import bookListScreen from './screen/bookListScreen';
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
                <Stack.Screen name='profileChange' component = {profileChange}/>
                <Stack.Screen name='ocrPage' component = {ocrPage}/>
                <Stack.Screen name='pageGruep' component={pageGruep} options={{headerShown: false, gestureEnabled: false}}/>
                <Stack.Screen name='searchPage' component={searchPage} />
                <Stack.Screen name='bookDetailsPage' component={bookDetailsPage}/>
                <Stack.Screen name='profileMake' component={profileMake} options={{headerShown: false}}/>
                <Stack.Screen name='myStudy' component={myStudy} />
                <Stack.Screen name='libsel' component={libsel} />
                <Stack.Screen name='booklibsel' component={booklibsel}/>
                <Stack.Screen name='mapPage' component={mapPage}/>
                <Stack.Screen name='ocrBookResult' component={ocrBookResult} />
                <Stack.Screen name="ocrPage2" component={ocrPage2} />
            </Stack.Navigator>
        </NavigationContainer >
    )
} 


export default StackNavigation;

