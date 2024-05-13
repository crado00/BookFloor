import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import mainPage from './mainPage';
import MyPage from './MyPage';

const Tab = createMaterialTopTabNavigator();

export default function PageGruepTap(){
    return (
        <Tab.Navigator tabBarPosition = 'bottom'>
            <Tab.Screen name = '메인페이지' component={mainPage}/>
            <Tab.Screen name = '마이페이지' component={MyPage}/>
        </Tab.Navigator>
    )
}