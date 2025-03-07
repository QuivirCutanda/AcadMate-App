import React from "react";
import { Avatar } from "react-native-paper";

import { ImageSourcePropType, View } from "react-native";

interface CustomAvatarProps {
  source: ImageSourcePropType;
  size: number;
}

const CustomAvatar: React.FC<CustomAvatarProps> = ({ source = require("@/assets/Avatar/user.png"), size = 34 }) => {
  return (
    <View className="mx-4 rounded-full border border-primary">
        <Avatar.Image size={size} source={source} />
    </View>
  );
};

export default CustomAvatar;
