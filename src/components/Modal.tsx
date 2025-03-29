import React, { ReactNode, useEffect } from 'react';
import { Modal, View, Text } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

interface CustomModalProps {
  visible: boolean;
  children: ReactNode;
}

const CustomModal: React.FC<CustomModalProps> = ({ visible, children }) => {
  const scale = useSharedValue(0.5); 
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      scale.value = withSpring(1, { damping: 10, stiffness: 100 });
      opacity.value = withSpring(1);
    } else {
      scale.value = withSpring(0.5);
      opacity.value = withSpring(0);
    }
  }, [visible]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Modal transparent visible={visible} animationType="none">
      <View className="flex-1 justify-center items-center bg-black/50">
        <Animated.View
          style={animatedStyle}
          className="bg-white p-4 rounded-2xl shadow-lg w-80 items-center"
        >
          {children}
        </Animated.View>
      </View>
    </Modal>
  );
};

export default CustomModal;
