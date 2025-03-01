import { View, Text } from "react-native";
import React from "react";
import Animated, { useAnimatedScrollHandler } from "react-native-reanimated";
import { FlatList } from "react-native";
import { useScroll } from "@/components/ScrollContext";

const dummyData = Array.from({ length: 20 }, (_, index) => ({
  id: index.toString(),
  title: `Card ${index + 1}`,
  description: `This is the description for card ${index + 1}.`,
}));

const DashBoard = () => {
  const { scrollHandler } = useScroll();

  return (
    <View style={{ flex: 1, backgroundColor: "#f3f3f3",  }}>
      <Animated.FlatList
        data={dummyData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={{
              backgroundColor: "white",
              padding: 16,
              // marginBottom: 12,
              borderRadius: 12,
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>
              {item.title}
            </Text>
            <Text>{item.description}</Text>
          </View>
        )}
        onScroll={scrollHandler} 
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default DashBoard;
