import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import ProfileForm from "@/src/components/userAccount/ProfileForm";
import useHideTabBar from "@/src/hooks/useHideTabBar";
import CustomModal from "@/src/components/CustomModal";
import Sucess from "@/assets/animation/Successful.json";

import {
  loadUserData,
  saveUserData,
} from "@/src/components/userAccount/utils/storage";
import LottieView from "lottie-react-native";

const UpdateProfile = () => {
  useHideTabBar();
  const router = useRouter();
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    profilePic: null as string | null,
  });
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      const storedData = await loadUserData();
      setUserData((prev) => ({
        ...prev,
        ...storedData,
      }));
    };
    fetchUserData();
  }, []);

  const saveProfile = async () => {
    if (!userData.firstName.trim() || !userData.lastName.trim()) {
      alert("First Name and Last Name cannot be empty.");
      return;
    }
    setLoading(true);
    await saveUserData(userData);
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

  return (
    <>
      <CustomModal
        visible={modalVisible}
        onOk={() =>{
          setModalVisible(false)
          router.back();
        }
      } 
      >
        <LottieView
        autoPlay
        loop={false}
        source={Sucess}
        style={{width:250,height:100}}
        />
        <Text className="text-center text-green-500 text-lg font-bold">
          Update Successfully
        </Text>
      </CustomModal>
      <View className="p-4 bg-secondary flex-row items-center gap-4">
        <TouchableOpacity onPress={router.back} className="ml-2 flex-1">
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-primary text-lg font-bold">Update Profile</Text>
        <View className="flex-1"></View>
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

      <View className="flex-1  bg-[#E0E0E0]"></View>
      <View className="bg-[#E0E0E0]">  
      <TouchableOpacity
        onPress={async () => {
          await saveProfile();
          setModalVisible(true);
        }}
        className={`mt-4 mb-20 mx-4 px-6 py-3  rounded-lg flex flex-row justify-center items-center ${
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
    </>
  );
};

export default UpdateProfile;
