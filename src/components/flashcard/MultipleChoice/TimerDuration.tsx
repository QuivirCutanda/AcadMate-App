import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { MotiView, MotiText } from "moti";

interface TimerProps {
  durationTime: (timer: number) => void;
}

const TimerDuration: React.FC<TimerProps> = ({ durationTime }) => {
  const durations = [5, 10, 15, 60, 120, 300];

  return (
    <View className="w-full">
      <MotiView
        from={{ opacity: 0, translateY: -10 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: "timing", duration: 500 }}
        className="bg-secondary p-4 rounded-2xl mb-4"
      >
        <MotiText
          from={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", delay: 100 }}
          className="text-center text-lg text-primary font-bold"
        >
          Select Time Duration
        </MotiText>
      </MotiView>

      {durations.map((time, index) => (
        <MotiView
          key={time}
          from={{ opacity: 0, translateY: 10 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: "timing", duration: 500, delay: index * 100 }}
        >
          <TouchableOpacity
            onPress={() => durationTime(time)}
            activeOpacity={0.7}
            className="bg-secondary/10 p-4 mb-2 flex-row items-center rounded-lg"
          >
            <MotiView
              from={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring" }}
              className="mr-4"
            >
              <MaterialCommunityIcons name="timer" size={24} color="#005596" />
            </MotiView>
            <MotiText
              from={{ opacity: 0, translateX: -10 }}
              animate={{ opacity: 1, translateX: 0 }}
              transition={{ type: "spring", delay: index * 100 }}
              className="text-secondary text-sm font-bold"
            >
              {time < 60 ? `${time} secs` : `${time / 60} min`}
            </MotiText>
          </TouchableOpacity>
        </MotiView>
      ))}
    </View>
  );
};

export default TimerDuration;
