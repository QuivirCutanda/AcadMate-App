import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { TextInput, Avatar } from "react-native-paper";
import { Entypo } from "@expo/vector-icons";

interface ProfileFormProps {
  firstName: string;
  lastName: string;
  email: string;
  profilePic: string | null;
  setFirstName: (text: string) => void;
  setLastName: (text: string) => void;
  setEmail: (text: string) => void;
  pickImage: () => void;
}

const ProfileForm: React.FC<ProfileFormProps> = ({
  firstName,
  lastName,
  email,
  profilePic,
  setFirstName,
  setLastName,
  setEmail,
  pickImage,
}) => {
  return (
    <View className="flex-col p-4 gap-4  bg-[#E0E0E0]">
      <TouchableOpacity
        onPress={pickImage}
        className="self-center rounded-full m-4 border-2 border-secondary"
      >
        <Avatar.Image
          size={90}
          source={
            profilePic
              ? { uri: profilePic }
              : require("@/assets/Avatar/user.png")
          }
        />
        <View className="absolute bottom-0 right-0 p-1 bg-[#E0E0E0] border-secondary border rounded-full">
          <Entypo name="camera" size={18} color="black" />
        </View>
      </TouchableOpacity>

      <TextInput
        textColor="#005596"
        mode="outlined"
        label="First Name"
        value={firstName}
        onChangeText={setFirstName}
        theme={{
          colors: {
            primary: "#005596",
            outline: "#005596", 
            text: "#005596",
            placeholder: "#005596",
            background: "#E0E0E0",
            
          },
        }}
      />
      <TextInput
        textColor="#005596"
        mode="outlined"
        label="Last Name"
        value={lastName}
        onChangeText={setLastName}
        theme={{
          colors: {
            primary: "#005596",
            outline: "#005596", 
            text: "#005596",
            placeholder: "#005596",
            background: "#E0E0E0",
          },
        }}
      />
      <TextInput
        textColor="#005596"
        mode="outlined"
        label="Email"
        value={email}
        onChangeText={setEmail}
        theme={{
          colors: {
            primary: "#005596",
            outline: "#005596", 
            text: "#005596",
            placeholder: "#005596",
            background: "#E0E0E0",
          },
        }}
      />
    </View>
  );
};

export default ProfileForm;
