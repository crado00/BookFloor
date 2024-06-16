import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Button, Text , Image, TouchableOpacity, TextInput, Dimensions} from 'react-native';
import MapPage from './mapPagemain';
import { PERMISSIONS, requestMultiple } from 'react-native-permissions';
import Geolocation from "react-native-geolocation-service"
import axios from 'axios';

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
  
export default function(){
    
  
    return (
        <View style = {{flex: 1}}>
            <MapPage/>
        </View>
    )
}