import AsyncStorage from "@react-native-async-storage/async-storage";

export const loadUserData = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem("userProfile");
    return jsonValue ? JSON.parse(jsonValue) : {};
  } catch (error) {
    console.error("Error loading data:", error);
    return {};
  }
};

export const saveUserData = async (userData: object) => {
  try {
    await AsyncStorage.setItem("userProfile", JSON.stringify(userData));
    // alert("Profile updated successfully!");
  } catch (error) {
    console.error("Error saving data:", error);
  }
};