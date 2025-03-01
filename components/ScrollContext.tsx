import { createContext, useContext } from "react";
import {
  useSharedValue,
  useAnimatedScrollHandler,
  type SharedValue,
} from "react-native-reanimated";

type ScrollContextType = {
  scrollY: SharedValue<number>;
  scrollHandler: ReturnType<typeof useAnimatedScrollHandler>;
};

const ScrollContext = createContext<ScrollContextType | undefined>(undefined);

export const ScrollProvider = ({ children }: { children: React.ReactNode }) => {
  const scrollY = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: ({ contentOffset: { y } }) => {
      scrollY.value = y;
    },
  });

  return (
    <ScrollContext.Provider value={{ scrollY, scrollHandler }}>
      {children}
    </ScrollContext.Provider>
  );
};

export const useScroll = () => {
  const context = useContext(ScrollContext);
  if (context === undefined) {
    throw new Error("useScroll must be used within a ScrollProvider");
  }
  return context;
};
