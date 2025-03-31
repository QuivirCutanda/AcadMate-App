import { useRef } from "react";
import { Animated } from "react-native";

  // Shake animation reference
 export  const shakeAnimation = useRef(new Animated.Value(0)).current;

  // Function to trigger shake animation
  export const triggerShake = () => {
    Animated.sequence([
      Animated.timing(shakeAnimation, {
        toValue: 10, // Move right
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: -10, // Move left
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 10, // Move right again
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 0, // Back to original position
        duration: 50,
        useNativeDriver: true,
      }),
    ]).start();
  };