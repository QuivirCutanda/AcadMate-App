import { View, TouchableOpacity, Animated } from "react-native";
import React, { memo, useEffect, useRef } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface TimerProps {
  durationTime: (timer: number) => void;
}

const TimerDuration: React.FC<TimerProps> = ({ durationTime }) => {
  const durations = [5, 10, 15, 60, 120, 300];

  // Animated Values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-10)).current;

  useEffect(() => {
    // Parallel animation for fade-in & slide-down effect
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View className="w-full">
      {/* Title Section */}
      <Animated.View
        style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}
        className="bg-secondary p-4 rounded-2xl mb-4"
      >
        <Animated.Text className="text-center text-lg text-primary font-bold">
          Select Time Duration
        </Animated.Text>
      </Animated.View>

      {/* Timer Options */}
      {durations.map((time, index) => {
        const itemFadeAnim = useRef(new Animated.Value(0)).current;
        const itemSlideAnim = useRef(new Animated.Value(10)).current;

        useEffect(() => {
          Animated.parallel([
            Animated.timing(itemFadeAnim, {
              toValue: 1,
              duration: 400,
              delay: index * 80,
              useNativeDriver: true,
            }),
            Animated.timing(itemSlideAnim, {
              toValue: 0,
              duration: 400,
              delay: index * 80,
              useNativeDriver: true,
            }),
          ]).start();
        }, []);

        return (
          <Animated.View
            key={time}
            style={{
              opacity: itemFadeAnim,
              transform: [{ translateY: itemSlideAnim }],
            }}
          >
            <TouchableOpacity
              onPress={() => durationTime(time)}
              activeOpacity={0.7}
              className="bg-secondary/10 p-4 mb-2 flex-row items-center rounded-lg"
            >
              {/* Timer Icon */}
              <Animated.View style={{ transform: [{ scale: 1 }] }} className="mr-4">
                <MaterialCommunityIcons name="timer" size={24} color="#005596" />
              </Animated.View>

              {/* Time Text */}
              <Animated.Text className="text-secondary text-sm font-bold">
                {time < 60 ? `${time} secs` : `${time / 60} min`}
              </Animated.Text>
            </TouchableOpacity>
          </Animated.View>
        );
      })}
    </View>
  );
};

export default memo(TimerDuration);
