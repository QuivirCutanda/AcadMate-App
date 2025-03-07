import React from "react";
import { Pressable, TouchableOpacity } from "react-native";
import Animated, { useAnimatedStyle, useDerivedValue, withSpring, interpolate } from "react-native-reanimated";
import LottieView from "lottie-react-native";

import AI from "@/assets/animation/AI-icon.json";
import { useScroll } from "@/components/ScrollContext";

interface AskAIButtonProps{
  onPress:()=>void;
}
const AskAIButton = ({ onPress }:AskAIButtonProps) => {
  const { scrollY } = useScroll();

  const animatedSize = useDerivedValue(() =>
    withSpring(scrollY.value < 50 ? 50 : 130, { damping: 15, stiffness: 120 })
  );

  const textOpacity = useDerivedValue(() =>
    withSpring(scrollY.value < 50 ? 0 : 1, { damping: 100, stiffness: 120 })
  );

  const animatedStyle = useAnimatedStyle(() => ({
    width: animatedSize.value,
    height: 50,
    borderRadius: interpolate(animatedSize.value, [50, 130], [50, 25]),
    flexDirection: "row",
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: scrollY.value < 50 ? "center" : "flex-start",
    overflow: "hidden", 
  }));

  const textAnimatedStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
    transform: [{ translateX: interpolate(textOpacity.value, [0, 1], [-10, 0]) }], 
    right: 10
  }));

  const lottieAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: interpolate(animatedSize.value, [50, 130], [0, -15]) }], 
    left: scrollY.value < 50 ? 10 : 10
  }));

  return (
    <TouchableOpacity onPress={onPress} className="absolute bottom-20 right-5">
      <Animated.View
        style={[animatedStyle]}
        className=" bg-primary shadow-lg shadow-secondary"
      >
        <Animated.View style={lottieAnimatedStyle}>
          <LottieView autoPlay loop source={AI} style={{ width: 44, height: 44 }} />
        </Animated.View>
        <Animated.Text style={[textAnimatedStyle]} className="font-bold text-base text-secondary ml-2">
          Ask AI
        </Animated.Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

export default AskAIButton;
