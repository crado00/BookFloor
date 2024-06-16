import React, { useEffect } from 'react';
import StackNavigation from './navigation/StackNavigation';
import {
  request,
  PERMISSIONS,
  requestLocationAccuracy,
  requestMultiple,
} from 'react-native-permissions';
import { useCameraPermission } from 'react-native-vision-camera';

const App = () => { //네비게이터 연결
  useEffect(() =>{
    requestMultiple([
      PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
      PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION,
      PERMISSIONS.ANDROID.CAMERA
    ])
      .then((status) => {
        console.log(`Location request status: ${status}`);
      })
      .catch((e) => {
        console.error(`Location request has been failed: ${e}`);
      });
  },[])

  return (
    <StackNavigation />
  )
}
export default App;