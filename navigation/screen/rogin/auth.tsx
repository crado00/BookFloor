import AsyncStorage from '@react-native-async-storage/async-storage';

const storeUserData = async (token: string, userId: string, username: string, profileImage: string, libCode: string) => {
  try {
    await AsyncStorage.setItem('userData', JSON.stringify({ token, userId, username, profileImage, libCode }));
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
const updateUserData = async (updatedData: { [key: string]: any }) => {
  try {
    const userDataString = await AsyncStorage.getItem('userData');
    if (userDataString) {
      const userData = JSON.parse(userDataString);
      const updatedUserData = { ...userData, ...updatedData };
      await AsyncStorage.setItem('userData', JSON.stringify(updatedUserData));
    }
  } catch (error) {
    console.error('Failed to update user data:', error);
  }
};
export { storeUserData, retrieveUserData, updateUserData };