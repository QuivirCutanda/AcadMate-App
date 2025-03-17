import React from "react";
import { Modal, Text, Pressable, View } from "react-native";

interface CustomModalProps {
  visible: boolean;
  onOk: () => void;
  onCancel?: () => void;
  children: React.ReactNode;
}

const CustomModal: React.FC<CustomModalProps> = ({
  visible,
  onOk,
  onCancel,
  children,
}) => {
  return (
    <Modal animationType="fade" transparent visible={visible} onRequestClose={onOk}>
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="m-4 bg-[#E0E0E0] rounded-2xl p-8 items-center shadow-lg">
          {children}
          <View className="flex-row mt-6 items-center justify-around gap-4">
            {onCancel && (
              <Pressable className="rounded-2xl w-32 h-12 flex items-center justify-center shadow-sm bg-red-700" onPress={onCancel}>
                <Text className="text-white text-base ">Cancel</Text>
              </Pressable>
            )}
            <Pressable className="rounded-2xl w-32 h-12 flex items-center justify-center shadow-sm bg-secondary" onPress={onOk}>
              <Text className="text-white text-base ">Ok</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default CustomModal;
