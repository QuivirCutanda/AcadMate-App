import { Pressable, StyleSheet } from "react-native";
import { useEffect } from "react";
import Animated, { 
  interpolate, 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring 
} from "react-native-reanimated";
import { icons } from "@/assets/icon/icons";

interface TabBarButtonProps {
  isFocused: boolean;
  label: string;
  routeName: "index" | "study" | "finance" | "account";
  color: string;
  onPress: () => void;
  onLongPress: () => void;
}

const TabBarButton = ({
  isFocused,
  label,
  routeName,
  color,
  onPress,
  onLongPress,
}: TabBarButtonProps) => {
  const scale = useSharedValue(isFocused ? 1 : 0);

  useEffect(() => {
    scale.value = withSpring(isFocused ? 1 : 0, { duration: 350 });
  }, [isFocused, scale]);

  const animatedIconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(scale.value, [0, 1], [1, 1]) }],
    top: interpolate(scale.value, [0, 1], [0, 8]),
  }));

  const animatedTextStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scale.value, [0, 1], [1, 0]),
  }));

  const animatedLineStyle = useAnimatedStyle(() => ({
    transform: [{ scaleX: interpolate(scale.value, [0, 1], [0, 1]) }],
    opacity: scale.value,
  }));

  const IconComponent = icons[routeName];

  return (
    <Pressable onPress={onPress} onLongPress={onLongPress} style={styles.container}>
      <Animated.View style={animatedIconStyle}>
        {IconComponent && IconComponent({ color })}
      </Animated.View>
      <Animated.Text style={[{ color, fontSize: 10 }, animatedTextStyle]}>
        {label}
      </Animated.Text>
      <Animated.View
        style={[
          styles.activeLine,
          { backgroundColor: color },
          animatedLineStyle,
        ]}
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
  },
  activeLine: {
    height: 2,
    width: "40%",
  },
});

export default TabBarButton;
