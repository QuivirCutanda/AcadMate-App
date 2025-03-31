import React from "react";
import { View, TextInput, TouchableOpacity, Keyboard } from "react-native";
import { AntDesign } from "@expo/vector-icons";

interface TextInputComponentProps {
  input: string;
  setInput: (text: string) => void;
  handleSend: () => void;
  loading: boolean;
}

const TextInputComponent: React.FC<TextInputComponentProps> = ({
  input,
  setInput,
  handleSend,
  loading,
}) => {
  return (
    <View className="flex-row items-end bg-primary pb-8 rounded-t-3xl  gap-4 relative min-h-20">
      <TextInput
        className="flex-1 p-4 mt-1 ml-2 rounded-lg text-black text-base font-normal bg-white"
        placeholder="Message..."
        value={input}
        onChangeText={setInput}
        multiline
        textAlignVertical="top"
        style={{ minHeight: 50, maxHeight: 200, overflow: "hidden" }}
      />

      <TouchableOpacity
        className={`p-2 mr-4 rounded-full flex justify-center items-center ${
          loading || input.trim().length === 0 ? "bg-gray-300" : "bg-secondary"
        }`}
        onPress={() => {
          Keyboard.dismiss();
          handleSend();
        }}
        disabled={loading || input.trim().length === 0}
      >
        
      </TouchableOpacity>
    </View>
  );
};

export default TextInputComponent;
