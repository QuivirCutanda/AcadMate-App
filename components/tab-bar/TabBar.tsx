import { StyleSheet } from "react-native";
import TabBarButton from "./TabBarButton";
import Animated, {
  useAnimatedStyle,
  withSpring,
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
        translateY: withSpring(tabBarVisibility.value === 1 ? 0 : 100, { duration: 800 }),
      },
    ],
    opacity: withSpring(tabBarVisibility.value, { duration: 800 }),
  }));

  const noop = () => {};

  return (
    <Animated.View style={[styles.container, animatedTabBarStyle]}>
      {state.routes.map(({ key, name }: { key: string; name: string }, index: number) => {
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
          }
        };

        return (
          <TabBarButton
            key={key}
            isFocused={isFocused}
            label={label}
            routeName={name as "index" | "study" | "finance" | "account"}
            color={isFocused ? "#7DABF6" : "#666"}
            onPress={onPress}
            onLongPress={noop}
          />
        );
      })}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 15,
    left: 20,
    right: 20,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 15,
    borderRadius: 25,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 10,
    shadowOpacity: 0.1,
  },
});

export default TabBar;
