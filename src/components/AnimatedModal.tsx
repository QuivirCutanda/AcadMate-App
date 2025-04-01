import React, { useEffect, useRef } from "react";
import {
  Modal,
  View,
  Text,
  Animated,
  TouchableWithoutFeedback,
} from "react-native";

interface CustomModalProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  Width?: string;
}

const AnimatedModal: React.FC<CustomModalProps> = ({
  visible,
  onClose,
  children,
  Width = "80",
}) => {
  const modalScale = useRef(new Animated.Value(0.8)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const showAnimation = Animated.parallel([
      Animated.timing(modalScale, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]);

    const hideAnimation = Animated.parallel([
      Animated.timing(modalScale, {
        toValue: 0.8,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
    ]);

    if (visible) {
      modalScale.setValue(0.8);
      opacity.setValue(0);
      showAnimation.start();
    } else {
      hideAnimation.start();
    }

    return () => {
      showAnimation.stop();
      hideAnimation.stop();
    };
  }, [visible]);

  return (
    <Modal animationType="fade" transparent visible={visible} onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View className="flex-1 justify-center items-center bg-secondary/90 backdrop-blur-2">
          <TouchableWithoutFeedback>
            <Animated.View
              style={{
                transform: [{ scale: modalScale }],
                opacity: opacity,
              }}
              className={`bg-white p-4 rounded-2xl shadow-lg items-center  w-${Width}`}
            >
              {children}
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default AnimatedModal;
