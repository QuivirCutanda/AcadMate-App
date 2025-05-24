import { View, Text } from "react-native";
import React from "react";
import { Entypo } from "@expo/vector-icons";

interface BalanceProp{
  Remaining:number,
  MonthlyIncome:number,
  MonthlyExpenses:number
}
const BalanceCard = ({Remaining,MonthlyIncome,MonthlyExpenses}:BalanceProp) => {
  return (
    <View className="p-4 rounded-2xl bg-secondary flex-row justify-between items-center mt-4 shadow-lg shadow-black">
      <View flex-1>
        <Text className="font-bold text-xl text-primary">₱ {Remaining!=null?Remaining.toFixed(2):"00.00"}</Text>
        <Text className="text-base font-normal text-primary">Current Balance</Text>
        <Text className="font-bold text-xl text-primary">₱ {MonthlyIncome!=null?MonthlyIncome.toFixed(2):"00.00"}</Text>
        <Text className="text-base font-normal text-primary">Monthly Income</Text>
        <Text className="font-bold text-xl text-primary">₱ {MonthlyExpenses!=null?MonthlyExpenses.toFixed(2):"00.00"}</Text>
        <Text className="text-base font-normal text-primary">Monthly Expenses</Text>
      </View>
      <Entypo
        name="wallet"
        size={100}
        color="hsl(206, 100%, 70%)"
        className="self-center"
      />
    </View>
  );
};

export default BalanceCard;
