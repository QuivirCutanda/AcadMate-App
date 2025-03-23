import { View, Text, TouchableWithoutFeedback } from "react-native";
import { useState } from "react";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import DeckHeader from "./DeckHeader";
import DeckMenu from "./DeckMenu";
import ActionButton from "./ActionButton";

interface DeckProps {
  onPress: () => void;
  deleteDeck: () => void;
  editDeck: () => void;
  title: string;
  description?: string;
  totalCards: number;
  addCard: () => void;
  practice: () => void;
}

const Deck = ({
  onPress,
  title,
  description,
  totalCards,
  addCard,
  practice,
  deleteDeck,
  editDeck,
}: DeckProps) => {
  const [menuVisible, setMenuVisible] = useState(false);

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        setMenuVisible(false);
        onPress();
      }}
    >
      <View className="bg-primary rounded-lg p-4 shadow-lg shadow-black/30 relative w-full my-2">
        <DeckHeader
          title={title}
          menuVisible={menuVisible}
          setMenuVisible={setMenuVisible}
          deleteDeck={deleteDeck}
          editDeck={editDeck}
        />

        {/* Deck Description */}
        <Text className="text-base font-normal text-secondary">
          {description}
        </Text>
        <Text className="text-sm font-bold text-gray-400">{totalCards} Cards</Text>

        {/* Buttons */}
        <View className="flex-row justify-between items-center mt-4">
          <ActionButton
            onPress={addCard}
            icon={<AntDesign name="pluscircle" size={18} color="white" />}
            text="Add Card"
          />
          <ActionButton
            onPress={practice}
            icon={<MaterialIcons name="quiz" size={18} color="white" />}
            text="Practice"
          />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default Deck;
