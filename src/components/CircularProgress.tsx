import React, { useRef, useEffect } from "react";
import { View, Animated } from "react-native";
import Svg, { Circle } from "react-native-svg";

interface CircularProgressProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  textColor:string;
  backgroundColor?: string;
  duration?: number;
}

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const CircularProgress: React.FC<CircularProgressProps> = ({
  progress,
  size = 100,
  strokeWidth = 10,
  color = "#3498db",
  textColor = "#FFFFFF",
  backgroundColor = "#F0F8FF",
  duration = 1000, 
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const animatedProgress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    animatedProgress.setValue(0);

    Animated.timing(animatedProgress, {
      toValue: progress,
      duration,
      useNativeDriver: false,
    }).start();
  }, [progress]); 

  const animatedStrokeDashoffset = animatedProgress.interpolate({
    inputRange: [0, 100],
    outputRange: [circumference, 0], 
  });

  return (
    <View className="items-center justify-center">
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Background Circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Animated Progress Circle */}
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={animatedStrokeDashoffset} 
          transform={`rotate(-90 ${size / 2} ${size / 2})`} 
        />
      </Svg>
      <Animated.Text
        className={`absolute text-lg font-bold  text-primary`}
      >
        {progress}%
      </Animated.Text>
    </View>
  );
};

export default CircularProgress;
