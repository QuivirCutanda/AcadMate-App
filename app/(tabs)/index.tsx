import { Image, StyleSheet, Platform, Text, View } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function HomeScreen() {
  return (
   <View className='flex-1 bg-red-600 justify-center items-center'>
    <Text>
      Hello
    </Text>
   </View>
  );
}