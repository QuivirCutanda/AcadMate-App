import React, { useRef, useEffect, useState } from "react";
import { View, ScrollView } from "react-native";
import ChatBubble from "@/src/AI/component/ChatBubble";
import TextInputComponent from "./TextInputComponent";
import LottieView from "lottie-react-native";
import ChatTyping from "@/assets/animation/chat-typing.json";
import SuggestedPrompt from "@/src/AI/component/SuggestedPrompts";

interface Message {
  text: string;
  type: "user" | "ai";
}

interface ChatUIProps {
  input: string;
  setInput: (text: string) => void;
  messages: Message[];
  handleSend: () => void;
  loading: boolean;
}

const ChatUI: React.FC<ChatUIProps> = ({
  input,
  setInput,
  messages,
  handleSend,
  loading,
}) => {
  const [prompActive, setPrompActive] = useState(true);
  const [isHidden, setIsHidden] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const handlePromptPress = (description: string) => {
    setInput(description);
    setIsHidden(true);
    console.log("Clicked:", description);
  };
  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages, loading]);

  useEffect(() => {
    if (input == "" && prompActive) {
      setIsHidden(false);
      console.log("Input empty");
    } else {
      console.log("Input not empty");
      setIsHidden(true);
    }
  }, [input]);

  console.log("response: ", messages);
  return (
    <View className="flex-1 pt-1 bg-[#E0E0E0]">
      <ScrollView
        ref={scrollViewRef}
        className="flex-1 mb-4"
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      >
        {messages.map((msg, index) => (
          <View key={index}>
            <ChatBubble key={index} text={msg.text} type={msg.type} />
          </View>
        ))}
        {loading && (
          <View className="rounded-2xl w-[100px] mx-2">
            <LottieView
              autoPlay
              loop
              source={ChatTyping}
              style={{ width: 50, height: 50 }}
            />
          </View>
        )}
        <SuggestedPrompt handlePress={handlePromptPress} IsHidden={isHidden} />
      </ScrollView>
      <TextInputComponent
        input={input}
        setInput={setInput}
        handleSend={() => {
          handleSend();
          setPrompActive(false);
        }}
        loading={loading}
      />
    </View>
  );
};

export default ChatUI;
