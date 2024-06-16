import React, { useState, useEffect } from "react";
import { View } from 'react-native';
import { useRoute } from '@react-navigation/native';
import MapPage from "./mapPagesetlib";



export default function App() {
    const route = useRoute();

    try {
        console.log("data: "+route.params.data);
    } catch (error) {
        console.log ("data error: " + error);
    }
    console.log('확인')

    return (
        <View style={{ flex: 1 }}>
            <MapPage libraries={route.params?.data} />
        </View>
    );
}