import { View, Text, TouchableOpacity } from "react-native";
import { useRef, useCallback, useEffect } from "react";
import LottieView from "lottie-react-native";
import AppIntroSlider from "react-native-app-intro-slider";
import { useRouter } from "expo-router";
import NextArrow from "@/assets/animation/next-arrow.json";
import Celebration from "@/assets/animation/celebration.json";
import { StatusBar } from "expo-status-bar";
import { setupDatabase } from "@/src/database/database";
import { FlashcardTable } from "@/src/database/FlashcardsTable";

const slides = [
  {
    id: "1",
    title: "Stay Organized, Stay Ahead!",
    description:
      "Never miss a deadline again! Plan your day with to-do lists, smart reminders, and an alarm clock your ultimate productivity toolkit.",
    icon: require("@/assets/animation/on-boarding/todo.json"),
  },
  {
    id: "2",
    title: "Smarter Study, Better Results!",
    description:
      "Revise faster with flashcards, take powerful notes, and set study reminders. AcadMate keeps you on track for success!",
    icon: require("@/assets/animation/on-boarding/study-smart.json"),
  },
  {
    id: "3",
    title: "Your Finances, Made Simple!",
    description:
      "Easily track your allowance, log expenses, and see where your money goes—all in one smart, offline finance tracker.",
    icon: require("@/assets/animation/on-boarding/organize-finance.json"),
  },
];

export default function OnBoarding() {
  useEffect(() => {
    const initializeDatabase = async () => {
      await setupDatabase();
      await FlashcardTable();
    };
    initializeDatabase();
  }, [])
  
  const router = useRouter();
  const sliderRef = useRef<AppIntroSlider | null>(null);

  const goToSlide = useCallback((index: number) => {
    sliderRef.current?.goToSlide(index);
  }, []);

  return (
    <>
    <StatusBar style="dark" backgroundColor="#FFFFFF" />
      <AppIntroSlider
        ref={sliderRef}
        data={slides}
        renderItem={({ item }) => (
          <View className="flex-1 items-center justify-center p-4  bg-primary">
            <LottieView
              autoPlay
              loop
              source={item.icon}
              style={{ width: "80%", height: "60%" }}
            />
            <Text className="font-bold text-xl p-4 text-secondary">
              {item.title}
            </Text>
            <Text className="font-normal text-base p-4 text-center text-secondary">
              {item.description}
            </Text>
          </View>
        )}
        renderPagination={(activeIndex) => (
          <View className="w-full px-4 py-6  bg-primary">
            {/* Pagination Dots */}
            <View className="flex-row justify-center mb-4 ">
              {slides.map((_, index) => (
                <View
                  key={index}
                  className={`mx-1 rounded-full ${
                    activeIndex === index
                      ? "bg-secondary w-6 h-2"
                      : "bg-gray-300 w-2 h-2"
                  }`}
                />
              ))}
            </View>

            <View className="flex-row justify-between items-center w-full bg-primary">
              {activeIndex < slides.length - 1 ? (
                <>
                  <TouchableOpacity
                    className="px-4 py-2"
                    onPress={() => goToSlide(slides.length - 1)}
                  >
                    <Text className="text-gray-500 font-bold text-lg">Skip</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    className="px-4 py-2 flex-row items-center hover:bg-gray-200 rounded-full"
                    onPress={() => goToSlide(activeIndex + 1)}
                  >
                    <Text className="text-secondary font-bold pr-10 text-lg">Next</Text>
                    <LottieView
                      autoPlay
                      loop
                      source={NextArrow}
                      style={{
                        padding: 16,
                        position: "absolute",
                        right: 8,
                        bottom: 3,
                        transform: [{ rotate: "-90deg" }],
                      }}
                    />
                  </TouchableOpacity>
                </>
              ) : (
                <TouchableOpacity
                  className="px-6 py-3 bg-secondary rounded-full ml-auto"
                  onPress={() => router.replace("/createAcount")}
                >
                  <LottieView
                    autoPlay
                    loop={false}
                    source={Celebration}
                    style={{
                      padding: 50,
                      position: "absolute",
                    }}
                  />
                  <Text className="text-white font-bold text-base">Get Started</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
      />
    </>
  );
}
