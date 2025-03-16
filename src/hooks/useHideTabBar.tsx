import { useEffect } from "react";
import { useNavigation } from "@react-navigation/native";

/**
 * Recursively finds the bottom tab navigator and hides its tab bar.
 */
const useHideTabBar = () => {
  const navigation = useNavigation();

  useEffect(() => {
    let parent = navigation;
    
    // Traverse up the navigation tree to find the bottom tab navigator
    while (parent?.getParent()) {
      parent = parent.getParent();
    }

    parent?.setOptions({ tabBarStyle: { display: "none" } });

    return () => {
      parent?.setOptions({ tabBarStyle: { display: "flex" } });
    };
  }, [navigation]);
};

export default useHideTabBar;
