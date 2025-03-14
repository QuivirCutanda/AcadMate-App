import React from "react";
import { View, TouchableOpacity } from "react-native";
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
    <View className="flex-col p-4 gap-4">
      <TouchableOpacity onPress={pickImage} className="self-center rounded-full m-4">
        <Avatar.Image size={90} source={profilePic ? { uri: profilePic } : require("@/assets/Avatar/user.png")} />
        <View className="absolute bottom-0 right-0 p-2 bg-primary rounded-full">
          <Entypo name="camera" size={18} color="black" />
        </View>
      </TouchableOpacity>
      
      <TextInput mode="outlined" label="First Name" value={firstName} onChangeText={setFirstName} />
      <TextInput mode="outlined" label="Last Name" value={lastName} onChangeText={setLastName} />
      <TextInput mode="outlined" label="Email" value={email} onChangeText={setEmail} />
    </View>
  );
};

export default ProfileForm;