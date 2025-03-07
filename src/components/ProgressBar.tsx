import React, { useEffect, useRef } from "react";
import { View, Animated, Text } from "react-native";

interface ProgressBarProps {
  progress: number;
  fillColor: string;
  fillBackgroundColor: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress, fillColor, fillBackgroundColor }) => {
  const animatedWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedWidth, {
      toValue: progress,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  return (
    <View className="flex w-full">
      <View
        style={{ backgroundColor: fillBackgroundColor }}
        className="w-full h-2 rounded-full overflow-hidden"
      >
        <Animated.View
          style={{
            width: animatedWidth.interpolate({
              inputRange: [0, 100],
              outputRange: ["0%", "100%"],
            }),
            backgroundColor: fillColor,
          }}
          className="h-full rounded-full"
        />
      </View>

      <View className="flex-row justify-between items-center mt-1">
        <Text className="text-sm text-secondary font-normal">Progress</Text>
        <Text className="text-sm text-secondary font-normal">{progress}%</Text>
      </View>
    </View>
  );
};

export default ProgressBar;
