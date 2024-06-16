import React, { useState, useEffect } from "react";
import { View } from 'react-native';
import { useRoute } from '@react-navigation/native';
import MapPage from "./mapPage";



export default function App() {
    const route = useRoute();

    useEffect(() => {
        if (route.params?.update) {
          console.log("Updated Data: ", route.params.update);
          // updatedData를 사용하여 상태를 업데이트하거나 다른 작업을 수행합니다.
        }
      }, [route.params?.update]);
    return (
        <View style={{ flex: 1 }}>
            <MapPage libraries={route.params?.data}/>
        </View>
    );
}