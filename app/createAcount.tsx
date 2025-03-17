import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import ProfileForm from "@/src/components/userAccount/ProfileForm";
import { insertUser } from "@/src/database/userQueries";
import CustomModal from "@/src/components/CustomModal";
import Sucess from "@/assets/animation/Successful.json";
import LottieView from "lottie-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const createAcount = () => {
  const router = useRouter();
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    profilePic: null as string | null,
  });
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [isFirstLaunch, setIsFirstLaunch] = useState<boolean | null>(null);

  const saveProfile = async () => {
    if (!userData.firstName.trim() || !userData.lastName.trim()) {
      alert("First Name and Last Name cannot be empty.");
      return;
    }

    setLoading(true);

    try {
      const userId = await insertUser({
        firstname: userData.firstName,
        lastname: userData.lastName,
        email: userData.email,
        profilePic: userData.profilePic || "",
        id: 0,
      });

      if (userId) {
        console.log("User saved successfully with ID:", userId);
        setModalVisible(true);
      } else {
        console.error("Failed to save user.");
      }
    } catch (error) {
      console.error("Error saving user:", error);
    }

    setLoading(false);
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const fileUri = result.assets[0].uri;
      const fileName = fileUri.split("/").pop();
      const localUri = `${FileSystem.documentDirectory}${fileName}`;

      if (fileUri !== localUri) {
        await FileSystem.moveAsync({ from: fileUri, to: localUri });
      }

      setUserData((prev) => ({ ...prev, profilePic: localUri }));
    }
  };

  const checkFirstLaunch = async () => {
    try {
      const hasSeenOnboarding = await AsyncStorage.getItem("hasSeenOnboarding");
      if (hasSeenOnboarding === null) {
        await AsyncStorage.setItem("hasSeenOnboarding", "true");
        setIsFirstLaunch(true);
      } else {
        setIsFirstLaunch(false);
      }
    } catch (error) {
      console.error("Error checking onboarding status:", error);
      setIsFirstLaunch(false);
    }
  };

  return (
    <View className="flex-1 bg-[#E0E0E0]">
      <CustomModal
        visible={modalVisible}
        onOk={() => {
          setModalVisible(false);
          router.replace("/(tabs)/(home)");
        }}
      >
        <LottieView
          autoPlay
          loop={false}
          source={Sucess}
          style={{ width: 250, height: 100 }}
        />
        <Text className="text-center text-green-500 text-lg font-bold">
          Account created successfully!
        </Text>
      </CustomModal>
      <View className="bg-secondary p-4">
        <Text className="text-primary text-lg font-bold text-center">
          Create Account
        </Text>
      </View>

      <ProfileForm
        firstName={userData.firstName}
        lastName={userData.lastName}
        email={userData.email}
        profilePic={userData.profilePic}
        setFirstName={(val) =>
          setUserData((prev) => ({ ...prev, firstName: val }))
        }
        setLastName={(val) =>
          setUserData((prev) => ({ ...prev, lastName: val }))
        }
        setEmail={(val) => setUserData((prev) => ({ ...prev, email: val }))}
        pickImage={pickImage}
      />

      <View className="flex-1 bg-[#E0E0E0]"></View>
      <View className="bg-[#E0E0E0]">
        <TouchableOpacity
          onPress={async () => {
            await saveProfile();
            await checkFirstLaunch();
          }}
          className={`m-4 mx-4 px-6 py-3 rounded-lg flex flex-row justify-center items-center ${
            userData.firstName.trim() && userData.lastName.trim() && !loading
              ? "bg-accent"
              : "bg-gray-400"
          }`}
          disabled={
            !userData.firstName.trim() || !userData.lastName.trim() || loading
          }
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text className="text-primary text-center font-bold">Save</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default createAcount;
