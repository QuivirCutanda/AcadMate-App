import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

export const icons = {
  index: ({ isFocused, ...props }) => (
    <Ionicons name={isFocused ? "home" : "home-outline"} size={24} {...props} />
  ),
  study: ({ isFocused, ...props }) => (
    <Ionicons name={isFocused ? "library" : "library-outline"} size={24} {...props} />
  ),
  finance: ({ isFocused, ...props }) => (
    <MaterialCommunityIcons name={isFocused ? "wallet" : "wallet-outline"} size={24} {...props} />
  ),
  account: ({ isFocused, ...props }) => (
    <Ionicons name={isFocused ? "person-circle" : "person-circle-outline"} size={24} {...props} />
  ),
};
