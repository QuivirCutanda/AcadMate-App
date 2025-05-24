import React, { useCallback, useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import Animated from "react-native-reanimated";
import { MaterialIcons } from "@expo/vector-icons";
import { useScroll } from "@/components/ScrollContext";
import Header from "@/src/components/Header";
import BalanceCard from "@/src/components/finance/BalanceCard";
import Button from "@/src/components/Button";
import AskAIButton from "@/src/components/AskAIButton";
import { router, useFocusEffect } from "expo-router";
import { getMonthlySummary, subscribeToTransactionsUpdates } from "@/src/database/finance/finance_query";
import { getAllTasks, subscribeToTasksUpdates, Task } from "@/src/database/todo-list/todolist-query";
import { getAllUsers, subscribeToUserUpdates } from "@/src/database/userQueries";
import type { IconProps } from "@expo/vector-icons/build/createIconSet";

// Interface for user data
interface UserData {
  firstname: string;
  lastname: string;
  email: string;
  profile_pic: string | null;
}

// Interface for monthly financial summary
interface MonthlySummary {
  income: number;
  expenses: number;
  balance: number;
}

// Interface for FlatList item
type TaskListItem =
  | { key: "header" }
  | { key: "task"; task: Task };

const DashBoard: React.FC = () => {
  const { scrollHandler } = useScroll();
  const [userData, setUserData] = useState<UserData>({
    firstname: "",
    lastname: "",
    email: "",
    profile_pic: null,
  });
  const [monthlySummary, setMonthlySummary] = useState<MonthlySummary>({
    income: 0,
    expenses: 0,
    balance: 0,
  });
  const [todayTasks, setTodayTasks] = useState<Task[]>([]);

  // Fetch user data
  const fetchUserData = async () => {
    try {
      const users = await getAllUsers();
      if (users && users.length > 0) {
        setUserData({
          firstname: users[0].firstname || "",
          lastname: users[0].lastname || "",
          email: users[0].email || "",
          profile_pic: users[0].profilePic || null,
        });
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  // Fetch monthly financial summary
  const fetchMonthlySummary = async () => {
    try {
      const date = new Date();
      const month = date.getMonth() + 1; // JavaScript months are 0-based
      const year = date.getFullYear();
      const userId = 1; // Adjust based on your auth system
      const summary = await getMonthlySummary(userId, month, year);
      if (summary) {
        setMonthlySummary(summary);
      }
    } catch (error) {
      console.error("Error fetching monthly summary:", error);
    }
  };

  // Fetch today's tasks
  const fetchTodayTasks = async () => {
    try {
      const userId = 1; // Adjust based on your auth system
      const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format
      const tasks = await getAllTasks(userId, {
        isCompleted: false, // Show only incomplete tasks
      });
      // Filter tasks due today
      const todayTasks = tasks.filter(
        (task): task is Task & { due_date: string } =>
          task.due_date != null && task.due_date.split("T")[0] === today
      );
      setTodayTasks(todayTasks);
    } catch (error) {
      console.error("Error fetching today's tasks:", error);
      setTodayTasks([]);
    }
  };

  // Initial data fetch and subscriptions
  useEffect(() => {
    fetchUserData();
    fetchMonthlySummary();
    fetchTodayTasks();

    // Subscribe to updates
    const unsubscribeUser = subscribeToUserUpdates(fetchUserData);
    const unsubscribeTransactions = subscribeToTransactionsUpdates(fetchMonthlySummary);
    const unsubscribeTasks = subscribeToTasksUpdates(fetchTodayTasks);

    return () => {
      unsubscribeUser();
      unsubscribeTransactions();
      unsubscribeTasks();
    };
  }, []);

  // Refresh data when screen is focused
  useFocusEffect(
    useCallback(() => {
      fetchUserData();
      fetchMonthlySummary();
      fetchTodayTasks();
    }, [])
  );
  // Function to get icon and color based on task priority
  type MaterialIconName = keyof typeof MaterialIcons.glyphMap;

  const getPriorityIcon = (
    priority: number
  ): { name: MaterialIconName; color: string } => {
    switch (priority) {
      case 3: // High
        return { name: "whatshot", color: "#ef4444" }; // Red flame for high priority
      case 2: // Medium
        return { name: "warning", color: "#f59e0b" }; // Yellow warning for medium
      case 1: // Low
        return { name: "circle", color: "#10b981" }; // Green circle for low
      default: // None
        return { name: "task", color: "#6b7280" }; // Gray task icon for none
    }
  };

  return (
    <View className="flex-1 bg-gray-100">
      <Header userInfo={userData} />
      <Animated.ScrollView
        className="flex-1 p-4"
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        {/* Balance Card */}
        <BalanceCard
          MonthlyIncome={monthlySummary.income}
          MonthlyExpenses={monthlySummary.expenses}
          Remaining={monthlySummary.balance}
        />

        {/* Task Section */}
        <FlatList
          data={[
            { key: "header" },
            ...todayTasks.map((task) => ({ key: "task", task })),
          ]}
          keyExtractor={(item, index): string => {
            if (item.key === "header") return "header";
            if ("task" in item && item.task.id != null) return item.task.id.toString();
            return index.toString();
          }}
          renderItem={({ item }) => {
            if (item.key === "header") {
              return (
                <View className="flex-row items-center justify-between p-4 bg-white rounded-2xl shadow-sm my-2">
                  <View className="flex-col">
                    <Text className="font-semibold text-lg text-gray-800">
                      Your daily tasks
                    </Text>
                    <Text className="font-normal text-base text-gray-600">
                      {todayTasks.length} task{todayTasks.length !== 1 ? "s" : ""} due today
                    </Text>
                    <View className="mt-2">
                      <Button
                        title="View all tasks"
                        onPress={() => router.push("/(tabs)/(study)/(todoList)")}
                        className="bg-secondary text-white rounded-lg px-4 py-2"
                      />
                    </View>
                  </View>
                </View>
              );
            }
            if ("task" in item) {
              const { name: iconName, color: iconColor } = getPriorityIcon(item.task.priority);
              return (
                <TouchableOpacity
                  className="flex-row items-center p-4 bg-white rounded-xl mb-2 shadow-sm border border-gray-200 my-2"
                  onPress={() => {router.push("/(tabs)/(study)/(todoList)")}}
                >
                  <MaterialIcons name={iconName} size={24} color={iconColor} style={{ marginRight: 12 }} />
                  <View className="flex-1">
                    <Text className="font-semibold text-base text-gray-800">
                      {item.task.title}
                    </Text>
                    {item.task.description && (
                      <Text className="font-normal text-sm text-gray-500 mt-1">
                        {item.task.description}
                      </Text>
                    )}
                  </View>
                  {item.task.is_important && (
                    <MaterialIcons name="star" size={20} color="#f59e0b" />
                  )}
                </TouchableOpacity>
              );
            }
            return null;
          }}
          ListEmptyComponent={
            <View className="my-4">
              <Text className="text-gray-500 text-center">
                No tasks due today!
              </Text>
            </View>
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 160 }}
        />
      </Animated.ScrollView>

      <AskAIButton onPress={() => router.push("/(tabs-AI)")} />
    </View>
  );
};

export default DashBoard;