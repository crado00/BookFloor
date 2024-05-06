import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import postWritten from './postWritten';
import comment from './comment';
const Tab = createMaterialTopTabNavigator();



export default function MyTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="작성글" component={postWritten} />
      <Tab.Screen name="댓글" component={comment} />
    </Tab.Navigator>
  );
}