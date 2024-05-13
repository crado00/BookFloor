import React, { useState } from 'react';
import {
  Button,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  View,
  Alert,
  ToastAndroid,
} from 'react-native';
import { useNavigation  } from '@react-navigation/native';
import PageGruepTap from './pageGruepTap';


export default function(){
    return (
        <View style = {{flex: 1, backgroundColor: 'white'}}>
            <PageGruepTap/>
        </View>
    )
}