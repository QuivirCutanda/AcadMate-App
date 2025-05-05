import { View, Text } from "react-native";
import React from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import { FontAwesome } from "@expo/vector-icons";

interface NoInternetProps {
  onOk: () => void;
}

const NoInternet = ({ onOk }: NoInternetProps) => {
  return (
    <View className="w-full">
      <FontAwesome
        name="warning"
        size={80}
        color="#eab308"
        style={{ alignSelf: "center", padding: 16 }}
      />
      <Text className="text-yellow-500 text-lg text-center font-bold">
        No Internet Connection
      </Text>
      <Text className="text-yellow-500 text-sm text-center mb-4">
        Please connect to the Internet first.
      </Text>
      <TouchableOpacity activeOpacity={0.7} onPress={onOk} className="w-full">
        <Text className="bg-secondary p-4 rounded-2xl text-base text-primary font-bold text-center">
          Ok
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default NoInternet;
