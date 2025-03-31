import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import TextInput from "@/src/components/CustomTextInput";
import { Entypo, MaterialIcons } from "@expo/vector-icons";

type BottomSheetContentProps = {
  header: string;
  deckName: string;
  deckNameLabel: string;
  deckNamePlaceholder: string;
  setDeckName: (text: string) => void;
  deckDescription: string;
  DescriptionLabel: string;
  DescriptionRequired?: boolean;
  Descriptionplaceholder: string;
  setDeckDescription: (text: string) => void;
  onClose: () => void;
  onSave: () => void;
};

const BottomSheetContent: React.FC<BottomSheetContentProps> = ({
  header,
  deckName,
  deckNameLabel,
  deckNamePlaceholder,
  setDeckName,
  deckDescription,
  Descriptionplaceholder,
  setDeckDescription,
  DescriptionLabel,
  DescriptionRequired,
  onClose,
  onSave,
}) => {
  const isSaveDisabled = DescriptionRequired
    ? deckDescription === ""
    : deckName === "";

  return (
    <View className="flex-1 items-center justify-center px-4 bg-primary rounded-t-3xl">
      <Text className="text-lg font-bold text-secondary text-center my-4">
        {header}
      </Text>
      <TextInput
        label={deckNameLabel}
        placeholder={deckNamePlaceholder}
        value={deckName}
        onChangeText={setDeckName}
      />
      <TextInput
        label={DescriptionLabel}
        placeholder={Descriptionplaceholder}
        value={deckDescription}
        onChangeText={setDeckDescription}
      />
      <View className="flex-1 bg-red-500"></View>
      <View className="flex-row gap-4 justify-end w-full m-4">
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onClose}
          className="bg-red-500 px-6 py-3 rounded-xl flex-row justify-center items-center gap-2"
        >
          <MaterialIcons name="cancel" size={24} color="#FFFFFF" />
          <Text className="text-primary text-lg font-bold">Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onSave}
          disabled={isSaveDisabled}
          className={`px-6 py-3 rounded-xl flex-row justify-center items-center gap-2 ${
            isSaveDisabled ? "bg-gray-400" : "bg-secondary"
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
