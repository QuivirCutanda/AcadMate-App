import { View, Text, Pressable } from "react-native";
import { Entypo } from "@expo/vector-icons";

interface CardListProps {
  question: string;
  answer: string;
  onPress: () => void;
}

const CardItem: React.FC<CardListProps> = ({ question, answer, onPress }) => {

  return (
    <View className="relative">
      <Pressable
        className="flex-row justify-between items-start p-4 bg-primary rounded-2xl mx-4 my-1"
      >
        <View className="flex-col">
          <Text className="text-base font-normal text-secondary flex-wrap">
            {question}
          </Text>
          <Text className="text-sm font-bold text-secondary flex-wrap">
            {answer}
          </Text>
        </View>

        <Pressable
          onPress={(e) => {
            e.stopPropagation();
            onPress();
          }}
        >
          <Entypo name="dots-three-vertical" size={14} color="#005596" />
        </Pressable>
      </Pressable>
    </View>
  );
};

export default CardItem;
