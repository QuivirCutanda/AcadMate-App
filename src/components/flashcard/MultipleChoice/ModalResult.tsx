import { View, Text } from "react-native";
import React from "react";
import success from "@/assets/animation/Successful.json";
import LottieView from "lottie-react-native";
import { TouchableOpacity } from "react-native";

interface ModalResultProps{
    onTryAgain:()=>void;
    onDone:()=>void;
    correct:number|string;
    wrong:number|string;
}

const ModalResult = ({onTryAgain,onDone,correct,wrong}:ModalResultProps) => {
  return (
    <View className="flex w-full relative">
      <LottieView
        autoPlay
        loop={false}
        source={success}
        style={{
          width: 250,
          height: 250,
          position: "absolute",
          top: -140,
          right: -3,
        }}
      />
      <Text className="text-xl text-secondary font-bold text-center mt-4">
        Great Job!
      </Text>
      <Text className="text-base text-secondary font-normal text-center">
        You've completed the quiz!
      </Text>
        <View className="py-4 flex-row justify-center items-center gap-4">
            <Text className="text-secondary border-r border-secondary pr-4">Correct: {correct}</Text>
            <Text className="text-red-600">Wrong: {wrong}</Text>
        </View>
      <View className="flex-row justify-center items-center gap-4 mt-6">
        <TouchableOpacity 
        activeOpacity={0.7}
        onPress={onTryAgain}
        className="p-4 flex-1 bg-secondary/10 rounded-2xl">
          <Text className="text-secondary text-balance font-normal text-center">Try Again</Text>
        </TouchableOpacity>
        <TouchableOpacity 
        activeOpacity={0.7}
        onPress={onDone}
        className="p-4 flex-1 bg-secondary rounded-2xl">
          <Text className="text-primary text-balance font-normal text-center">Done</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ModalResult;
