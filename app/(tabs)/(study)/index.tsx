import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import Header from "@/src/components/Header";
import StudyCard from "@/src/study/StudyCard";
import Animated from "react-native-reanimated";
import { useRouter } from "expo-router";

import {
  MaterialIcons,
  MaterialCommunityIcons,
  Ionicons,
} from "@expo/vector-icons";
import AskAIButton from "@/src/components/AskAIButton";
import { useScroll } from "@/components/ScrollContext";

import {
  getAllUsers,
  subscribeToUserUpdates,
} from "@/src/database/userQueries";

const StudyList = [
  {
    icon: MaterialIcons,
    iconName: "format-list-bulleted",
    title: "Todo List",
    description: "Stay organized with task lists.",
  },
  {
    icon: MaterialCommunityIcons,
    iconName: "cards",
    title: "Flash Card",
    description: "Memorize fast with flashcards.",
  },
  {
    icon: MaterialIcons,
    iconName: "notes",
    title: "Notes",
    description: "Jot down and save ideas.",
  },
  // {
  //   icon: Ionicons,
  //   iconName: "alarm",
  //   title: "Alarm Clock",
  //   description: "Never miss study time!",
  // },
];
const study = () => {
  const { scrollHandler } = useScroll();
  const router = useRouter();

  const [userData, setUserData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    profile_pic: null as string | null,
  });

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

  useEffect(() => {
    fetchUserData();
    const unsubscribe = subscribeToUserUpdates(() => {
      console.log("Refreshing...");
      fetchUserData();
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleRoute = (id: number) => {
    switch (id) {
      case 0:
        router.navigate("/(tabs)/(study)/(todoList)");
        break;
      case 1:
        router.navigate("/(tabs)/(study)/(flashcard)");
        break;
      case 2:
        router.navigate("/(tabs)/(study)/(notes)");
        break;
      // case 3:
      //   router.navigate("/(tabs)/(study)/(notes)");
      //   break;
    }
  };

  return (
    <>
      <View className="bg-background-ligth">
        <Header userInfo={userData} />
      </View>
      <Animated.ScrollView
        className="flex-1 p-4 bg-background-ligth"
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        <Text className="text-2xl font-bold text-secondary my-4 pb-4">
          How can I help you?
        </Text>
        {StudyList.map((item, index) => (
          <View className="mb-4" key={index}>
            <StudyCard
              icon={item.icon}
              iconName={item.iconName}
              iconSize={40}
              title={item.title}
              description={item.description}
              iconColor="#FFFFFF"
              onPress={() => handleRoute(index)}
            />
          </View>
        ))}
      </Animated.ScrollView>
      <AskAIButton onPress={() => router.push("/(tabs-AI)")} />
    </>
  );
};

export default study;
