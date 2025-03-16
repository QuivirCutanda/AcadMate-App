import React from "react";
import { View, Text, TouchableOpacity, ToastAndroid } from "react-native";
import * as Clipboard from "expo-clipboard";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

interface CodeSyntaxFormatterProps {
  code: string;
}

const CodeSyntaxFormatter: React.FC<CodeSyntaxFormatterProps> = ({ code }) => {
  const codeParts = code.trim().split("\n");
  const firstLine = codeParts[0].trim();
  let filename = "";
  let formattedCode = code;

  if (firstLine.includes(".")) {
    filename = firstLine;
    formattedCode = codeParts.slice(1).join("\n");
  }

  const copyToClipboard = async (content: string) => {
    await Clipboard.setStringAsync(content.trim());
    ToastAndroid.show("Copied to clipboard!", ToastAndroid.SHORT);
  };

  return (
    <View className="bg-[#1e1e1e] p-2 rounded-2xl">
      {filename ? (
        <Text className="text-[#9cdcfe] mb-2 font-bold text-base">
          📄 {filename}
        </Text>
      ) : null}

      <TouchableOpacity
        onPress={() => copyToClipboard(formattedCode)} 
        className="rounded-xl self-end flex justify-center items-center p-2"
      >
        <FontAwesome5 name="copy" size={18} color="#e0e0e0" />
      </TouchableOpacity>

      <Text className="text-[#dcdcaa] p-2 text-base">{formattedCode.trim()}</Text>
    </View>
  );
};

export default CodeSyntaxFormatter;
