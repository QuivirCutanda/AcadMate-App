import { AntDesign, MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";

export const icons = {
    index: (props) => <AntDesign name="home" size={26} {...props} />,
    study: (props) => <Ionicons name="library-outline" size={26} {...props} />, 
    finance: (props) => <MaterialCommunityIcons name="chart-line-variant" size={26} {...props} />,
    account: (props) => <Ionicons name="person-circle-outline" size={26} {...props} />, 
};