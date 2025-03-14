import { View, Text } from 'react-native'
import React from 'react'
import Ionicons from '@expo/vector-icons/Ionicons';

const TemporaryChat = () => {
  return (
    <View className="flex-row justify-between items-center border-dotted border-2 border-secondary rounded-full px-2 mb-4">
        <Ionicons name="chatbubble-ellipses-outline" size={18} color="#005596" />
      <Text className="text-sm text-secondary font-semibold">Temporary Chat</Text>
    </View>
  )
}

export default TemporaryChat