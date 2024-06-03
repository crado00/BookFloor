import React, { useState, useEffect } from "react";
import { View } from 'react-native';
import { useRoute } from '@react-navigation/native';
import MapPage from "./mapPage";



export default function App() {
    const route = useRoute();

    

    return (
        <View style={{ flex: 1 }}>
            <MapPage libraries={route.params?.data} />
        </View>
    );
}