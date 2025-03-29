import { View, Text, TouchableWithoutFeedback } from "react-native";
import { useState } from "react";
import { AntDesign, Ionicons, MaterialIcons } from "@expo/vector-icons";
import DeckHeader from "./DeckHeader";
import DeckMenu from "./DeckMenu";
import ActionButton from "./ActionButton";

interface DeckProps {
  onPress?: () => void;
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
        onPress?.();
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

        {description !="" &&(  
        <Text className="text-base font-normal text-secondary">
          {description}
        </Text>
        )}
        <Text className="text-sm font-bold text-gray-400">{totalCards} Card/s</Text>

        <View className="flex-row justify-between items-center mt-4">
          <ActionButton
            onPress={addCard}
            icon={<Ionicons name="albums-outline" size={24} color="#FFFFFF" />}
            
            text="View Card/s"
          />
          <ActionButton
            onPress={practice}
            icon={   <MaterialIcons name="menu-book" size={24} color="#FFFFFF" />}
            text="Study Now"
          />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default Deck;
