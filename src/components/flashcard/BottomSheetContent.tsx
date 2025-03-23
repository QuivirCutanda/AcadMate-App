import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import TextInput from "@/src/components/CustomTextInput";
import { Entypo, MaterialIcons } from "@expo/vector-icons";

type BottomSheetContentProps = {
  deckName: string;
  setDeckName: (text: string) => void;
  deckDescription: string;
  setDeckDescription: (text: string) => void;
  onClose: () => void;
  onSave: () => void;
};

const BottomSheetContent: React.FC<BottomSheetContentProps> = ({
  deckName,
  setDeckName,
  deckDescription,
  setDeckDescription,
  onClose,
  onSave,
}) => {
  return (
    <View className="flex-1 items-center justify-center p-4">
      <Text className="text-xl font-bold text-secondary text-center mb-4">
        Creat a Flascard
      </Text>
      <TextInput
        label="Card Name"
        placeholder="Enter Card Name"
        value={deckName}
        onChangeText={setDeckName}
      />
      <TextInput
        label="Description - (Optional)"
        placeholder="Enter Description"
        value={deckDescription}
        onChangeText={setDeckDescription}
      />
      <View className="flex-row gap-4 justify-end w-full m-4">
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onClose}
          className="bg-red-500 px-6 py-3 rounded-xl flex-row justify-center items-center gap-2"
        >
          <MaterialIcons name="cancel" size={24} color="#FFFF" />
          <Text className="text-primary text-lg font-bold">Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onSave}
          disabled={deckName === ""}
          className={`px-6 py-3 rounded-xl flex-row justify-center items-center gap-2 ${
            deckName === "" ? "bg-gray-400" : "bg-secondary"
          }`}
        >
          <Entypo name="save" size={24} color="#FFFFFF" />
          <Text className="text-primary text-lg font-bold">Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default BottomSheetContent;
