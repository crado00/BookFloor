import React, { useRef, useState, useEffect, useMemo } from 'react';
import { View, Platform, Text, Image, PermissionsAndroid, TouchableOpacity, ToastAndroid, Button, TextInput, StyleSheet } from 'react-native';
import {
  type MapType,
  type NaverMapViewRef,
  type Camera,
  NaverMapView,
  NaverMapMarkerOverlay,
  NaverMapCircleOverlay,
} from '@mj-studio/react-native-naver-map';
import {
  request,
  PERMISSIONS,
  requestLocationAccuracy,
  requestMultiple,
} from 'react-native-permissions';
import { useNavigation, useRoute } from '@react-navigation/native';
import Geolocation from "react-native-geolocation-service"
import axios from 'axios';
// const jejuRegion: Region = {projectName\navigation\component\components.tsx
//   latitude: 33.20530773,
//   longitude: 126.14656715029,
//   latitudeDelta: 0.38,
//   longitudeDelta: 0.8,
// };

const Cameras = {
  Seolleung: {
    latitude: 37.50497126,
    longitude: 127.04905021,
    zoom: 14,
  },
  Gangnam: {
    latitude: 37.498040483,
    longitude: 127.02758183,
    zoom: 14,
  },
  Jeju: {
    latitude: 33.39530773,
    longitude: 126.54656715029,
    zoom: 8,
  },
} satisfies Record<string, Camera>;

/**
 * @private
 */
const MapTypes = [
  'Basic',
  'Navi',
  'Satellite',
  'Hybrid',
  'Terrain',
  'NaviHybrid',
  'None',
] satisfies MapType[];

interface Library {
  libCode: string;
  libName: string;
  tel: string;
  closed: string;
  operatingTime: string;
  address: string;
  latitude: number;
  longitude: number;
}

interface MapPageProps {
  libraries: Library[];
}

type Location = {
  latitude: number;
  longitude: number;
  zoom: number;
};

export default function mapPage() {
  const ref = useRef<NaverMapViewRef>(null);
  const navigation = useNavigation()
  const route = useRoute()
  const [camera, setCamera] = useState(Cameras.Seolleung);

  const [nightMode, setNightMode] = useState(false);
  const [indoor, setIndoor] = useState(false);
  const [mapType, setMapType] = useState<MapType>(MapTypes[0]!);
  const [lightness, setLightness] = useState(0);
  const [compass, setCompass] = useState(true);
  const [scaleBar, setScaleBar] = useState(true);
  const [zoomControls, setZoomControls] = useState(true);
  const [indoorLevelPicker, setIndoorLevelPicker] = useState(true);
  const [myLocation, setMyLocation] = useState(true);
  const [currentLocation, setCurrentLocation] = useState<Location>({latitude:0, longitude:0, zoom: 14})
  const [libdata, setlibdata] = useState(route.params?.data)

  const [search, setSearch] =useState("")
  
  const [selectedLibrary, setSelectedLibrary] = useState(null);

  useEffect(() => {
    if (Platform.OS === 'ios') {
      request(PERMISSIONS.IOS.LOCATION_ALWAYS).then((status) => {
        console.log(`Location request status: ${status}`);
        if (status === 'granted') {
          requestLocationAccuracy({
            purposeKey: 'common-purpose', // replace your purposeKey of Info.plist
          })
            .then((accuracy) => {
              console.log(`Location accuracy is: ${accuracy}`);
            })
            .catch((e) => {
              console.error(`Location accuracy request has been failed: ${e}`);
            });
        }
      });
    }
    if (Platform.OS === 'android') {
      requestMultiple([
        PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
        PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION,
      ])
        .then((status) => {
          console.log(`Location request status: ${status}`);
        })
        .catch((e) => {
          console.error(`Location request has been failed: ${e}`);
        });
    }
  }, []);
  useEffect(() => {
    const location = () => Geolocation.getCurrentPosition(
      (positon) =>{
        const {latitude, longitude} = positon.coords
        setCurrentLocation({ latitude: latitude, longitude: longitude, zoom: 12 })
      },
      (error) => {
        console.log(error)
      },
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 0,
        distanceFilter: 1
      }
    )
    location()
    console.log(`위치: ${currentLocation}`);
  }, [setCurrentLocation])


  const markerPress = (key: string) => {
  // event 객체를 사용하여 마커의 위치 등의 정보에 접근할 수 있습니다.
  // 선택된 마커의 정보를 상태에 업데이트합니다.
  console.log('확인');
  const data = libdata.find((library) => library.libCode === key);
  setSelectedLibrary(data);
  console.log(selectedLibrary)
  
};
const setlib = () => {
  console.log(selectedLibrary.libCode)
  navigation.reset({
    index:0,
    routes: [{name: 'profileMake', params: { libcode: selectedLibrary.libCode }}]
  })
}

  const handleSearch = async () => {
    const url = `http://10.0.2.2:3000/search`
        console.log(search !== '')

            if(search !== ''){                
                try{
                  console.log('확인')
                    const response = await axios.post(url,
                        {
                            name: search,
                            filters: {
                                date: '2024-06-14'
                            }
                        }
                    )
                    const obj = response.data;
                    console.log(obj)
                    if(obj){
                        const newData = obj.map((item) => {
                            const setlat = Number(item.LATITUDE);
                            const setlong = Number(item.LONGITUDE);
                              return {
                                  libCode: item.LBRRY_CD,
                                  libName: item.LIBRARY_NAME,
                                  tel: item.LIBRARY_TEL,
                                  closed: item.LIBRARY_CLOSED,
                                  operatingTime: item.OPERATINGTIME,
                                  address: item.ADDRESS,
                                  latitude: setlat,
                                  longitude: setlong
                              }
                          })
                          setlibdata(newData)
                    }
                  }catch(e){

                    console.log(e)
                  }

            }else{
                ToastAndroid.show('도서관 이름을 입력해 주세요.', ToastAndroid.SHORT);
            }
  }
  return (
    <View
      style={{
        flex: 1,
      }}
    >
      {<View style={{flexDirection: 'row', margin: 10}}>
        <TextInput
          style={{ flex: 1,
            borderColor: '#ccc',
            borderWidth: 1,
            marginRight: 10,
            padding: 8,}}
          value={search}
          onChangeText={setSearch}
          placeholder="도서관 이름을 입력하세요"
        />
        <Button title="검색" onPress={handleSearch} />
      </View>}
      <NaverMapView
        camera={currentLocation}
        // initialCamera={jejuCamera}
        // region={jejuRegion}
        // initialRegion={jejuRegion}
        ref={ref}
        style={{ flex: 1 }}
        mapType={mapType}
        layerGroups={{
          BUILDING: true,
          BICYCLE: false,
          CADASTRAL: false,
          MOUNTAIN: false,
          TRAFFIC: false,
          TRANSIT: false,
        }}
        fpsLimit={0}
        isIndoorEnabled={indoor}
        lightness={lightness}
        isNightModeEnabled={nightMode}
        isShowCompass={compass}
        isShowIndoorLevelPicker={indoorLevelPicker}
        isShowScaleBar={scaleBar}
        isShowZoomControls={zoomControls}
        isShowLocationButton={myLocation}
        isExtentBoundedInKorea
        onInitialized={() => console.log('initialized!')}
        onOptionChanged={() => console.log('Option Changed!')}
        // onCameraChanged={(args) =>
        //   console.log(`Camera Changed: ${formatJson(args)}`)
        // }
        onTapMap={(args) => {setSelectedLibrary(null)}}
      >
        {libdata.map((library) =>{
          return (
            <NaverMapMarkerOverlay
              key={library.libCode}
              latitude={library.latitude}
              longitude={library.longitude}
              onTap={() => markerPress(library.libCode)}
              anchor={{ x: 0.5, y: 1 }}
              width={25}
              height={30}
              image={require('./image/marker_icon.png')}
              caption={{text: library.libName, textSize: 12}}
            />
          )
        })}
        
      </NaverMapView>
          {/* 선택된 도서관 정보를 표시합니다. */}
    {selectedLibrary && (
      <View style={{backgroundColor: 'white', height: 200}}>
        <View style = {{alignItems: 'center', marginBottom: 20}}>
          <Text style = {{fontSize: 30,}}>{selectedLibrary.libName}</Text>
        </View>
        <View style = {{marginLeft:10, marginBottom: 5}}>
          <Text>전화번호: {selectedLibrary.tel}</Text>
        </View>
        <View style = {{marginLeft:10, marginBottom: 5}}>
          <Text>오픈시간: {selectedLibrary.operatingTime}</Text>
        </View>
        <View style = {{marginLeft:10, marginBottom: 5}}>
          <Text>휴관일: {selectedLibrary.closed}</Text>
        </View>
        <View style = {{marginLeft:10, marginBottom: 5}}>
          <Text>주소: {selectedLibrary.address}</Text>
        </View>
        <Button title='선택' onPress={setlib}/>
        {/* 선택된 도서관의 다른 정보도 표시할 수 있습니다. */}
      </View>
    )}
    </View>
  );
}

const styles = StyleSheet.create({
  markerContainer: {
    position: 'absolute',
    alignItems: 'center',
  },
  markerTextContainer: {
    backgroundColor: 'white',
    padding: 2,
    borderRadius: 5,
    marginTop: -5,
  },
  markerText: {
    fontSize: 12,
    color: 'black',
  },
});