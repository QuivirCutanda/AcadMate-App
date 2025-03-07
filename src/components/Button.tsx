import { TouchableOpacity, Text } from "react-native";

interface ButtonProps {
  title: string;
  onPress: () => void;
  className?: string;
  textClassName?: string;
}

const CustomButton: React.FC<ButtonProps> = ({ title, onPress, className = "", textClassName = "" }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`mt-4 bg-accent rounded-md ${className}`}
    >
      <Text className={`text-primary text-center font-normal py-2  text-sm ${textClassName}`}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default CustomButton;
