import React, { ReactNode } from 'react';
import { Modal, Pressable, View, Text } from 'react-native';

interface CustomModalProps {
  visible: boolean;
  children: ReactNode;
}

const CustomModal: React.FC<CustomModalProps> = ({ visible, children }) => {
  return (
    <Modal animationType="fade" transparent visible={visible}>
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="bg-white p-4 rounded-2xl shadow-lg w-80 items-center">
          {children}
        </View>
      </View>
    </Modal>
  );
};

export default CustomModal;
