import React, { useState, useEffect } from "react";
import { StyleSheet } from "react-native";
import { FAB, Portal } from "react-native-paper";

type FabGroupProps = {
  actions: { icon: string; label: string; onPress: () => void }[];
  visible: boolean;
};

const CustomFabGroup: React.FC<FabGroupProps> = ({ actions, visible}) => {
  const [open, setOpen] = useState(false);
  
  useEffect(() => {
    if (visible) {
      setOpen(false);
    }
  }, [visible]);

  return (
    <Portal>
      <FAB.Group
        open={open}
        visible={!visible} 
        icon={open ? "close" : "plus"}
        actions={actions.map((action) => ({
          ...action,
          color: "#005596",
          backgroundColor: "#005596",
          labelTextColor: "#005596",
        }))}
        onStateChange={({ open }) => setOpen(open)}
        color="#005596"
      />
    </Portal>
  );
};

export default CustomFabGroup;
