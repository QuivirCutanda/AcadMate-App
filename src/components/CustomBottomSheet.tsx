import React, { useRef, useCallback, useMemo, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import BottomSheet from "@gorhom/bottom-sheet";

type CustomBottomSheetProps = {
  isVisible: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

const CustomBottomSheet: React.FC<CustomBottomSheetProps> = ({
  isVisible,
  onClose,
  children,
}) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["50%"], []);

  useEffect(() => {
    if (isVisible) {
      bottomSheetRef.current?.expand();
    } else {
      bottomSheetRef.current?.close();
    }
  }, [isVisible]);

  const handleSheetChange = useCallback(
    (index: number) => {
      if (index === -1) {
        onClose();
      }
    },
    [onClose]
  );

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={isVisible ? 0 : -1}
      snapPoints={snapPoints}
      enableDynamicSizing={false}
      handleComponent={null}
      onChange={handleSheetChange}
      style={styles.bottomSheet}
    >
      <View className="flex-1 bg-primary shadow-lg">{children}</View>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  bottomSheet: {
    zIndex: 1000,
    elevation: 15,
  },
});

export default CustomBottomSheet;
