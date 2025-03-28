import { View, Text } from 'react-native'
import React from 'react'
import LottieView from 'lottie-react-native'
import EmptyBox from "@/assets/animation/Empty-box.json";

const EmptyFlashCard = () => {
  return (
    <View className="flex-1 justify-center items-center mt-10">
          <LottieView
          autoPlay
          source={EmptyBox}
          style={{width:300,height:300}}
          />
          <Text className="text-lg text-secondary font-bold">Empty Flashcard</Text>
        </View>
  )
}

export default EmptyFlashCard