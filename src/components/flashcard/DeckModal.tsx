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
  // { key: "importPDF", label: "Import from PDF", icon: "file-pdf" },
  { key: "importDocs", label: "Import from Docs", icon: "file-word" },
  // { key: "scanImage", label: "Scan from Image", icon: "camera" },
];

const StudyModal: React.FC<CustomModalProps> = ({
  visible,
  onClose,
  selectedOption,
}) => {
  const modalScale = useRef(new Animated.Value(0.8)).current;
  const scaleAnimations = useRef(
    FlashcardOptions.map(() => new Animated.Value(0))
  ).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(modalScale, {
          toValue: 1,
          friction: 5,
          useNativeDriver: true,
        }),
        Animated.stagger(
          80,
          scaleAnimations.map((anim) =>
            Animated.spring(anim, {
              toValue: 1,
              friction: 5,
              useNativeDriver: true,
            })
          )
        ),
      ]).start();
    } else {
      Animated.timing(modalScale, {
        toValue: 0.8,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        scaleAnimations.forEach((anim) => anim.setValue(0));
      });
    }
  }, [visible]);

  return (
    <Modal animationType="fade" transparent visible={visible} onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View className="flex-1 justify-center items-center bg-black/50">
          <TouchableWithoutFeedback>
            <Animated.View
              style={{ transform: [{ scale: modalScale }] }}
              className="bg-primary p-6 rounded-2xl shadow-lg w-96 items-center"
            >
              <Text className="text-lg font-bold text-secondary mb-8">
              CREATE FLASH CARD
              </Text>

              {FlashcardOptions.map((option, index) => (
                <Animated.View
                  key={option.key}
                  style={{ transform: [{ scale: scaleAnimations[index] }] }}
                  className="w-full"
                >
                  <TouchableOpacity
                    activeOpacity={0.8}
                    className="flex-row items-center bg-secondary p-4 rounded-lg mb-2 w-full"
                    onPress={() => selectedOption(option.key)}
                  >
                    <View className="w-12 h-12 bg-primary rounded-full justify-center items-center">
                      <FontAwesome5 name={option.icon} size={20} color="#005596" />
                    </View>

                    <View className="flex-1 ml-3">
                      <Text className="text-primary font-medium">{option.label}</Text>
                    </View>
                  </TouchableOpacity>
                </Animated.View>
              ))}
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default StudyModal;