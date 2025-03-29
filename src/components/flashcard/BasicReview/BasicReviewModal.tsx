import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import LottieView from "lottie-react-native";
import Success from "@/assets/animation/celebration.json";
import Done from "@/assets/animation/Successful.json";
import AnimatedModal from "@/src/components/AnimatedModal";

interface BasicReviewModalProps {
  onPressBtnLeft?: () => void;
  onPressBtnRight: () => void;
  onClose: () => void;
  visible: boolean;
}

export default function BasicReviewModal({
  onPressBtnLeft,
  onPressBtnRight,
  onClose,
  visible,
}: BasicReviewModalProps) {
  return (
    <AnimatedModal onClose={onClose} visible={visible}>
      <View className="flex justify-center items-center">
        <LottieView
          autoPlay
          loop={false}
          source={Done}
          style={{ width: 150, height: 70 }}
        />
        <Text className="text-lg font-bold text-secondary mb-4">
          Review Complete
        </Text>
        <View className="mt-4 flex-row gap-4">
          {onPressBtnLeft && (
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={() => {
                console.log("Repeat all button clicked");
                onPressBtnLeft && onPressBtnLeft();
              }}
              className="p-4 bg-secondary/20 rounded-2xl flex-1"
            >
              <Text className="text-base font-normal text-center text-secondary">
                Repeat all
              </Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
             onPress={() => {
              console.log("Done button clicked");
              onPressBtnRight();
            }}
            activeOpacity={0.5}
            className="p-4 bg-secondary rounded-2xl flex-1"
          >
            <Text className="text-base font-normal text-center text-primary">
              Done
            </Text>
          </TouchableOpacity>
        </View>
        <View className="absolute bottom-16 right-0 p-4 bg-transparent">
          <LottieView
            autoPlay
            loop={false}
            source={Success}
            style={{ width: 200, height: 200 }}
          />
        </View>
      </View>
    </AnimatedModal>
  );
}
