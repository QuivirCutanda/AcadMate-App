import React, { useEffect, useRef } from "react";
import {
  Modal,
  View,
  Text,
  Animated,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";

interface CustomModalProps {
  visible: boolean;
  selectedOption: (key: string) => void;
  onClose: () => void;
}

const FlashcardOptions = [
  { key: "manualEntry", label: "Create from Scratch", icon: "pencil-alt" },
  { key: "importPDF", label: "Import from PDF", icon: "file-pdf" },
  { key: "importDocs", label: "Import from Docs", icon: "file-word" },
  { key: "scanImage", label: "Scan from Image", icon: "camera" },
];

const DeckModal: React.FC<CustomModalProps> = ({
  visible,
  onClose,
  selectedOption,
}) => {
  const scaleAnimations = useRef(
    FlashcardOptions.map(() => new Animated.Value(0))
  ).current;

  useEffect(() => {
    if (visible) {
      Animated.stagger(
        80,
        scaleAnimations.map((anim) =>
          Animated.spring(anim, {
            toValue: 1,
            friction: 5,
            useNativeDriver: true,
          })
        )
      ).start();
    } else {
      scaleAnimations.forEach((anim) => anim.setValue(0));
    }
  }, [visible]);

  return (
    <Modal animationType="fade" transparent visible={visible} onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View className="flex-1 justify-center items-center bg-black/50">
          <TouchableWithoutFeedback>
            <View className="bg-primary p-4 rounded-2xl shadow-lg w-80 items-center">
              <Text className="text-lg font-bold mb-4 text-secondary">Create Flash Card</Text>

              {FlashcardOptions.map((option, index) => (
                <Animated.View
                  key={option.key}
                  style={{
                    transform: [{ scale: scaleAnimations[index] }],
                  }}
                  className="w-full"
                >
                  <TouchableOpacity
                    activeOpacity={0.8}
                    className="flex-row items-center justify-start bg-secondary p-4 rounded-lg mb-2 w-full"
                    onPress={() => selectedOption(option.key)}
                  >
                    <View className="w-10 ml-2">
                      <FontAwesome5 name={option.icon} size={18} color="#FFFFFF" />
                    </View>
                    <Text className="text-primary font-medium flex-1 text-start">
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                </Animated.View>
              ))}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default DeckModal;
