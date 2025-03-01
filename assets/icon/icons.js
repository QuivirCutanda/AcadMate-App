import { AntDesign, MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";

export const icons = {
index: (props) => <AntDesign name="home" size={24} {...props} />,
    study: (props) => <Ionicons name="library-outline" size={24} {...props} />, 
    finance: (props) => <MaterialCommunityIcons name="wallet" size={24} {...props} />,
    account: (props) => <Ionicons name="person-circle-outline" size={24} {...props} />, 
};