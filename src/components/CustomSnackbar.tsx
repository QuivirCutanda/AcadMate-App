import * as React from "react";
import { Snackbar } from "react-native-paper";

interface SnackbarProps {
  visible: boolean;
  message: string;
  onDismiss: () => void;
  backgroundColor?: string;
  actionLabel?: string;
  onActionPress?: () => void;
}

const CustomSnackbar: React.FC<SnackbarProps> = ({
  visible,
  message,
  onDismiss,
  backgroundColor = "black",
  actionLabel,
  onActionPress,
}) => {
  React.useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        onDismiss();
      }, 500);

      return () => clearTimeout(timer); 
    }
  }, [visible, onDismiss]);

  return (
    <Snackbar
      visible={visible}
      onDismiss={onDismiss}
      style={{ backgroundColor }}
      action={
        actionLabel && onActionPress
          ? { label: actionLabel, onPress: onActionPress }
          : undefined
      }
    >
      {message}
    </Snackbar>
  );
};

export default CustomSnackbar;
