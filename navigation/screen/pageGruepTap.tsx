import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import mainPage from './mainPage';
import MyPage from './MyPage';
import gruepMap from './gruepMap';

const Tab = createMaterialTopTabNavigator();

export default function PageGruepTap(){
    return (
        <Tab.Navigator tabBarPosition = 'bottom' screenOptions={{swipeEnabled: false}}>
            <Tab.Screen name = '메인페이지' component={mainPage}/>
            <Tab.Screen name='맵페이지' component={gruepMap}/>
            <Tab.Screen name = '마이페이지' component={MyPage}/>
        </Tab.Navigator>
    )
}