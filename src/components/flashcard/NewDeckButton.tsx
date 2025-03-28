import React from "react";
import { TouchableOpacity } from "react-native";
import Animated, { useAnimatedStyle, useDerivedValue, withSpring, interpolate } from "react-native-reanimated";
import { useScroll } from "@/components/ScrollContext";
import { Entypo } from "@expo/vector-icons";

interface NewDeckButtonProps {
  onPress: () => void;
  className?: string;
}

const NewDeckButton = ({ onPress,className }: NewDeckButtonProps) => {
  const { scrollY } = useScroll();

  const animatedSize = useDerivedValue(() =>
    withSpring(scrollY.value < 20 ? 60 : 150, { damping: 15, stiffness: 120 })
  );

  const textOpacity = useDerivedValue(() =>
    withSpring(scrollY.value < 20 ? 0 : 1, { damping: 100, stiffness: 120 })
  );

  const animatedStyle = useAnimatedStyle(() => ({
    width: animatedSize.value,
    height: 60,
    borderRadius: interpolate(animatedSize.value, [60, 150], [60, 25]),
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: scrollY.value < 50 ? 0 : 16,
    justifyContent: scrollY.value < 50 ? "center" : "flex-start",
    overflow: "hidden",
  }));

  const textAnimatedStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
    transform: [{ translateX: interpolate(textOpacity.value, [0, 1], [-10, 0]) }],
    marginLeft: scrollY.value < 50 ? 0 : 25, 
  }));

  const iconStyle = useAnimatedStyle(() => ({
    position: "absolute",
    left: scrollY.value < 50 ? "50%" : 10,
    transform: [{ translateX: scrollY.value < 50 ? -12 : 0 }],
    marginLeft: scrollY.value < 50 ? 0 : 8, 
  }));

  return (
    <TouchableOpacity 
    activeOpacity={0.9}
    onPress={onPress} 
    className={`absolute bottom-0 m-4 right-0 flex-row justify-center items-center ${className}`}>
      <Animated.View style={[animatedStyle]} className="bg-secondary shadow-lg shadow-secondary">
        <Animated.View style={iconStyle}>
          <Entypo name="plus" size={24} color="#FFFFFF" />
        </Animated.View>
        <Animated.Text style={[textAnimatedStyle]} className="font-bold text-lg text-primary">
          New Deck
        </Animated.Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

export default NewDeckButton;
