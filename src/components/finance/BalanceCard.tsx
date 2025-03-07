import { View, Text } from "react-native";
import React from "react";
import { Entypo } from "@expo/vector-icons";

const BalanceCard = () => {
  return (
    <View className="p-4 rounded-2xl bg-secondary flex-row justify-between items-center mt-4 shadow-lg shadow-black">
      <View flex-1>
        <Text className="font-bold text-lg text-primary">₱ 8,000.00</Text>
        <Text className="text-xs font-normal text-primary">Remaining</Text>
        <Text className="font-bold text-lg text-primary">₱ 800.00</Text>
        <Text className="text-xs font-normal text-primary">Budget</Text>
        <Text className="font-bold text-lg text-primary">₱ 7000.56</Text>
        <Text className="text-xs font-normal text-primary">Expenses</Text>
      </View>
      <Entypo
        name="wallet"
        size={110}
        color="hsl(206, 100%, 70%)"
        className="self-center"
      />
    </View>
  );
};

export default BalanceCard;
