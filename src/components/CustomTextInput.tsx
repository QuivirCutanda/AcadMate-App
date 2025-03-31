import React from "react";
import { TextInput, View, Text } from "react-native";

type CustomTextInputProps = {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
  error?: string;
};

const CustomTextInput: React.FC<CustomTextInputProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = "default",
  error,
}) => {
  return (
    <View className="mb-4 w-full">
      {label && <Text className="text-secondary text-lg mb-2">{label}</Text>}
      <TextInput
        className="border border-gray-400  rounded-xl p-4 w-full text-base font-normal text-secondary bg-primary focus:border-secondary "
        placeholder={placeholder}
        // placeholderTextColor="#005596"
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        multiline
        textAlignVertical="top"
        numberOfLines={5}
        style={{ minHeight: 10, maxHeight: 100 }}
      />
      {error && <Text className="text-red-500 text-sm mt-1">{error}</Text>}
    </View>
  );
};

export default CustomTextInput;
