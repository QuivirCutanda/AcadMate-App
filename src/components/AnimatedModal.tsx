import React, { useEffect, useRef } from "react";
import {
  Modal,
  View,
  Text,
  Animated,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";

interface CustomModalProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const AnimatedModal: React.FC<CustomModalProps> = ({
  visible,
  onClose,
  children,
}) => {
  const modalScale = useRef(new Animated.Value(0.8)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(modalScale, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(modalScale, {
          toValue: 0.8,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
        <View className="flex-1 justify-center items-center bg-black/50">
          <Animated.View
            style={{
              transform: [{ scale: modalScale }],
              opacity: opacity,
            }}
            className="bg-white p-6 rounded-2xl shadow-lg w-80 items-center"
          >
            {children}
          </Animated.View>
        </View>
    </Modal>
  );
};

export default AnimatedModal;
