import { useEffect } from "react";
import { BackHandler } from "react-native";

const useBackHandler = (callback: () => boolean) => {
  useEffect(() => {
    const handleBackPress = () => {
      return callback(); 
    };

    const backHandler = BackHandler.addEventListener("hardwareBackPress", handleBackPress);

    return () => backHandler.remove();
  }, [callback]);
};

export default useBackHandler;
