import React, { useState } from "react";
import { View, TouchableOpacity, Text } from "react-native";
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
  const [isEmailValid, setIsEmailValid] = useState(true);

  const handleEmailChange = (text: string) => {
    setEmail(text);
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsEmailValid(text === "" || emailPattern.test(text));
  };

  return (
    <View className="flex-col gap-4 bg-[#E0E0E0]">
      <View className="bg-secondary pb-8 rounded-b-3xl">
        <TouchableOpacity
          onPress={pickImage}
          className="self-center rounded-full m-4 border-2 border-primary"
        >
          <Avatar.Image
            size={90}
            source={
              profilePic
                ? { uri: profilePic }
                : require("@/assets/Avatar/user.png")
            }
          />
          <View className="absolute bottom-[-5] right-0 p-2 border-primary bg-secondary border rounded-full">
            <Entypo name="camera" size={18} color="#FFFFFF" />
          </View>
        </TouchableOpacity>
      </View>

      <View className="gap-4 p-4">
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
              onSurfaceVariant:"#005596",
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
              onSurfaceVariant:"#005596",
              background: "#E0E0E0",
            },
          }}
        />
        <View>
          <TextInput
            textColor={isEmailValid ? "#005596" : "#D32F2F"}
            mode="outlined"
            label="Email"
            value={email}
            onChangeText={handleEmailChange}
            placeholder="Enter your email"
            style={{ color: isEmailValid ? "#005596" : "#D32F2F" }}
            theme={{
              colors: {
                primary: isEmailValid ? "#005596" : "#D32F2F",
                outline: isEmailValid ? "#005596" : "#D32F2F",
                text: isEmailValid ? "#005596" : "#D32F2F",
                placeholder: isEmailValid ? "#005596" : "#D32F2F",
                onSurfaceVariant: isEmailValid ? "#005596" : "#D32F2F",
                background: "#E0E0E0",
              },
            }}
          />

          {!isEmailValid && (
            <Text className="text-red-500 text-start  text-xs">
              *Please enter a valid email address.
            </Text>
          )}
        </View>
      </View>
    </View>
  );
};

export default ProfileForm;
