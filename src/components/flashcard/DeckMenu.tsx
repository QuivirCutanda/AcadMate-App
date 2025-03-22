import { View, Text, TouchableOpacity, Animated, Easing, TouchableWithoutFeedback } from "react-native";
import { useEffect, useRef } from "react";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";

interface DeckMenuProps {
  setMenuVisible: (visible: boolean) => void;
  deleteDeck: () => void;
  editDeck: () => void;
}

const DeckMenu = ({ setMenuVisible,deleteDeck,editDeck }: DeckMenuProps) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-10)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 200,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();

    return () => {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: -10,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    };
  }, []);

  return (
    <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        }}
        className="absolute top-10 right-2 bg-white shadow-lg rounded-md z-10 py-2 px-4"
      >
        <TouchableOpacity
          onPress={() => {
            editDeck();
            setMenuVisible(false);
          }}
          className="flex-row items-center gap-2 p-2"
        >
          <AntDesign name="edit" size={20} color="#005596" />
          <Text className="text-sm text-secondary">Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            deleteDeck();
            setMenuVisible(false);
          }}
          className="flex-row items-center gap-2 p-2"
        >
          <MaterialIcons name="delete" size={20} color="red" />
          <Text className="text-sm text-red-500">Delete</Text>
        </TouchableOpacity>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

export default DeckMenu;
