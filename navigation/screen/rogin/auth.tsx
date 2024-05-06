import AsyncStorage from '@react-native-async-storage/async-storage';

const storeUserData = async (token: string, userId: string) => {
  try {
    await AsyncStorage.setItem('userData', JSON.stringify({ token, userId }));
  } catch (error) {
    console.error('Failed to store user data:', error);
  }
};

const retrieveUserData = async () => {
  try {
    const userData = await AsyncStorage.getItem('userData');
    console.log(userData);
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Failed to retrieve user data:', error);
    return null;
  }
};

export { storeUserData, retrieveUserData };