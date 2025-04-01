import { Text, TouchableOpacity } from "react-native";

interface ActionButtonProps {
  icon: JSX.Element;
  text: string;
  onPress: () => void;
}

const ActionButton = ({ icon, text,onPress }: ActionButtonProps) => (
  <TouchableOpacity
    onPress={() => {
      onPress();
    }}
    activeOpacity={0.8}
    className="flex-row items-center justify-center gap-2 bg-secondary rounded-lg py-2 px-4"
  >
    {icon}
    <Text className="text-base text-primary">{text}</Text>
  </TouchableOpacity>
);

export default ActionButton;
