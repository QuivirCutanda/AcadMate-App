import React, { useEffect, useRef, useState } from "react";
import { View, Text, Animated, Easing } from "react-native";

interface LinearTimerProps {
  duration: number; 
  start: boolean; 
  height?: number; 
  color?: string; 
  onComplete?: () => void; 
}

const LinearTimer: React.FC<LinearTimerProps> = ({
  duration,
  start,
  height = 8,
  color = "#3498db",
  onComplete,
}) => {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const [timeLeft, setTimeLeft] = useState(duration);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (start) {
      animatedValue.setValue(0);
      setTimeLeft(duration);

      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current as NodeJS.Timeout);
            if (onComplete) onComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      Animated.timing(animatedValue, {
        toValue: 1,
        duration: duration * 1000,
        easing: Easing.linear,
        useNativeDriver: false,
      }).start();
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [start]); 

  const progressWidth = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"], 
  });

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <View className="w-ful">
      <Text className="mb-2 text-sm font-bold text-secondary text-center">
        {formatTime(timeLeft)}
      </Text>

      <View
        className="w-full bg-gray-300 rounded-full overflow-hidden"
        style={{ height }}
      >
        <Animated.View
          style={{ width: progressWidth, height, backgroundColor: color }}
        />
      </View>
    </View>
  );
};

export default LinearTimer;
