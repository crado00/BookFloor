import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';


const MyPage = () =>{
    return(
    <View style={styles.container}>
      <View style={styles.box1} />
      <View style={styles.box2} />
      <View style={styles.box3} />
    </View>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'row', // 가로 방향으로 요소 배치
      justifyContent: 'space-between', // 요소 간격을 최대한 넓힘
      alignItems: 'center', // 요소를 수직 가운데 정렬
      backgroundColor: '#fff',
      padding: 20,
    },
    box1: {
      width: 50,
      height: 50,
      backgroundColor: 'red',
    },
    box2: {
      width: 50,
      height: 50,
      backgroundColor: 'green',
    },
    box3: {
      width: 50,
      height: 50,
      backgroundColor: 'blue',
    },
  });

export default MyPage;