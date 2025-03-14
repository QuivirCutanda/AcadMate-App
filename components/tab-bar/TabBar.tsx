import { StyleSheet, View } from "react-native";
import TabBarButton from "./TabBarButton";
import Animated, {
  useAnimatedStyle,
  withTiming,
  useAnimatedReaction,
  useSharedValue,
} from "react-native-reanimated";
import { useScroll } from "@/components/ScrollContext";

type TabBarProps = {
  state: any;
  descriptors: any;
  navigation: any;
};

const TabBar = ({ state, descriptors, navigation }: TabBarProps) => {
  const { scrollY } = useScroll();
  const tabBarVisibility = useSharedValue(1);
  const prevScroll = useSharedValue(0);

  useAnimatedReaction(
    () => scrollY.value,
    (current) => {
      if (current - prevScroll.value > 5) {
        tabBarVisibility.value = 0;
      } else if (prevScroll.value - current > 5) {
        tabBarVisibility.value = 1;
      }
      prevScroll.value = current;
    }
  );

  const animatedTabBarStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: withTiming(tabBarVisibility.value === 1 ? 0 : 100, {
          duration: 300,
        }),
      },
    ],
  }));

  return (
    <Animated.View style={[styles.container, animatedTabBarStyle]}>
      {state.routes.map(
        ({ key, name }: { key: string; name: string }, index: number) => {
          const { options } = descriptors[key] || {};
          const label = options?.tabBarLabel ?? options?.title ?? name;
          const isFocused = state.index === index;
          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(name);
              // console.log("Route Name: "+name);
            }
          };

          return (
              <TabBarButton
                key={key}
                isFocused={isFocused}
                label={label}
                routeName={name as "(home)" | "(study)" | "(finance)" | "(userAccount)"}
                color={isFocused ? "#005595" : "#666"}
                onPress={onPress}
                onLongPress={() => {}}
              />
          );
        }
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 5,
    shadowColor: "black",
    shadowOffset: { width: 0, height: -5 },
    shadowRadius: 10,
    shadowOpacity: 0.2,
    elevation: 10,
  },
});

export default TabBar;
