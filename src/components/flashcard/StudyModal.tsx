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
  {
    key: "BasicReview",
    label: "Basic Review",
    description: "Flip cards to see answers.",
    icon: "pencil-alt",
  },
  {
    key: "MultipleChoice",
    label: "Multiple Choice",
    description: "Pick the right answer.",
    icon: "tasks",
  },
  {
    key: "MultipleChoiceTimer",
    label: "Multiple Choice (Timer)",
    description: "Answer within time.",
    icon: "clock",
  },
  {
    key: "WritingReview",
    label: "Writing Review",
    description: "Type your answers.",
    icon: "edit",
  },
];



const StudyModal: React.FC<CustomModalProps> = ({
  visible,
  onClose,
  selectedOption,
}) => {
  const scaleAnimations = useRef(
    FlashcardOptions.map(() => new Animated.Value(0))
  ).current;

  const modalScale = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(modalScale, {
          toValue: 1,
          duration: 250,
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
        duration: 150,
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
              <Text className="text-lg font-bold text-secondary mb-4">
                SELECT STUDY TYPE
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
                      <Text className="text-xs text-primary">{option.description}</Text>
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