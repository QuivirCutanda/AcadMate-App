import { View, Text, TouchableOpacity } from "react-native";
import { Entypo } from "@expo/vector-icons";
import DeckMenu from "./DeckMenu";

interface DeckHeaderProps {
  menuVisible: boolean;
  setMenuVisible: (visible: boolean) => void;
  editDeck: () => void;
  deleteDeck: () => void;
  title:string;
}

const DeckHeader = ({title, menuVisible, setMenuVisible,deleteDeck,editDeck }: DeckHeaderProps) => {
  return (
    <View className="flex-row justify-between items-center">
      <Text className="text-secondary text-lg font-bold">{title}</Text>

      <TouchableOpacity
        onPress={(e) => {
          e.stopPropagation();
          setMenuVisible(!menuVisible);
        }}
        activeOpacity={0.8}
      >
        <Entypo name="dots-three-vertical" size={18} color="#005596"/>
      </TouchableOpacity>

      {menuVisible && <DeckMenu setMenuVisible={setMenuVisible} deleteDeck={deleteDeck} editDeck={editDeck}/>}
    </View>
  );
};

export default DeckHeader;
