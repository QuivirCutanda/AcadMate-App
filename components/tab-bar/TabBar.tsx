import { StyleSheet, View } from "react-native";
import TabBarButton from "./TabBarButton";


type TabBarProps = {
  state: any;
  descriptors: any;
  navigation: any;
};

const TabBar = ({ state, descriptors, navigation }: TabBarProps) => {
  return (
    <View style={styles.container}>
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
            }
          };

          return (
            <TabBarButton
              key={key}
              isFocused={isFocused}
              label={label}
              routeName={name as "(home)" | "(study)" | "(finance)" | "(userAccount)"}
              color={isFocused ? "#005595" : "#655"}
              onPress={onPress}
              onLongPress={() => {}}
            />
          );
        }
      )}
    </View>
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