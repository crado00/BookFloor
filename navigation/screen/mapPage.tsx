import React, { useRef, useState, useEffect, useMemo } from 'react';
import { View, Platform, Text, Image, PermissionsAndroid } from 'react-native';
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
import { formatJson, generateArray } from '@mj-studio/js-util';
import Geolocation from "react-native-geolocation-service"
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

export default function mapPage({ libraries }: MapPageProps) {
  const ref = useRef<NaverMapViewRef>(null);

  const [camera, setCamera] = useState(Cameras.Jeju);

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
        setCurrentLocation({ latitude: latitude, longitude: longitude, zoom: 14 })
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

/* 사용자 위치 주소정보 서치
  const getAddressFromCoordinates = async (latitude, longitude) => {
    const clientId = 'YOUR_NAVER_CLIENT_ID';
    const clientSecret = 'YOUR_NAVER_CLIENT_SECRET';
    const response = await axios.get(
      `https://naveropenapi.apigw.ntruss.com/map-reversegeocode/v2/gc?coords=${longitude},${latitude}&orders=roadaddr,addr&output=json`,
      {
        headers: {
          'X-NCP-APIGW-API-KEY-ID': clientId,
          'X-NCP-APIGW-API-KEY': clientSecret,
        },
      }
    );
    const { results } = response.data;
    const address = results[0].region.area1.name + ' ' +
                    results[0].region.area2.name + ' ' +
                    results[0].region.area3.name + ' ' +
                    results[0].region.area4.name;
    setAddress(address);
  };*/

  return (
    <View
      style={{
        flex: 1,
      }}
    >
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
        onTapMap={(args) => console.log(`Map Tapped: ${formatJson(args)}`)}
      >
        {libraries.map((library) =>{
          return (
            <>
        
        <NaverMapMarkerOverlay
          latitude={library.latitude}
          longitude={library.longitude}
          onTap={() => console.log(1)}
          anchor={{ x: 0.5, y: 1 }}
          width={25}
          height={30}
          key={library.libCode}
          image={require('./image/marker_icon.png')}
        >
        </NaverMapMarkerOverlay>
        
      </>
          )
        })}
        <NaverMapMarkerOverlay
          latitude={currentLocation.latitude}
          longitude={currentLocation.longitude}
          onTap={() => console.log(1)}
          anchor={{ x: 0.5, y: 1 }}
          width={25}
          height={30}
          image={require('./image/marker_icon.png')}
        >
        </NaverMapMarkerOverlay>
      </NaverMapView>
    </View>
  );
}