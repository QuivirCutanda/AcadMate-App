import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Drawer } from "react-native-drawer-layout";
import { useRouter } from "expo-router";

import Header from "@/src/AI/component/AIHeader";
import ChatComponent from "@/src/AI/component/ChatComponent";
import ChatHistory from "@/src/AI/component/DrawerComponent";
import CustomModal from "@/src/components/CustomModal";

import useBackHandler from "@/src/hooks/useBackHandler";
import useInternetStatus from "@/src/hooks/useInternetStatus";

import { insertMessage, getMessagesByUser } from "@/src/database/AIqueries";

interface Message {
  text: string;
  type: "user" | "ai";
}

interface ChatData {
  id: number;
  user_id: number;
  timestamp: string;
  conversation: MessagesState;
}

interface MessagesState {
  [key: string]: Message;
}

export default function ChatScreen() {
  const router = useRouter();
  const { isConnected, isInternetReachable } = useInternetStatus();
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<MessagesState>({});
  const [history, setHistory] = useState<ChatData[]>([]);

  useEffect(() => {
    setVisible(!(isConnected && isInternetReachable));
  }, [isConnected, isInternetReachable]);

  
  const handleBackPress = () => {
    if (Object.keys(messages).length > 0) {
      insertMessage(1, messages)
      router.back();
    } else {
      router.back();
    }
    return true;
  };
  useBackHandler(handleBackPress);

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      try {
        const chatHistory = await getMessagesByUser(1);
        setHistory(chatHistory);
      } catch (error) {
        console.error("Error fetching chat history:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const handleClearChat = async () => {
    await insertMessage(1, messages);
    setMessages({});
    const chatHistory = await getMessagesByUser(1);
    setHistory(chatHistory);
    console.log("Chat cleared and saved.");
  };

  const sortConversation = (conversation: MessagesState) =>
    Object.entries(conversation)
      .sort(
        ([a], [b]) =>
          parseInt(a.replace("msg-", ""), 10) -
          parseInt(b.replace("msg-", ""), 10)
      )
      .map(([, message]) => message);

  const getHistory = useCallback(
    (index: number) => {
      setOpen(false);
      if (!history[index]) {
        console.error("Invalid index: Conversation not found.");
        return [];
      }
      const sortedConversation = sortConversation(history[index].conversation);
      setMessages(
        Object.fromEntries(
          sortedConversation.map((msg, i) => [`msg-${i + 1}`, msg])
        )
      );
      return sortedConversation;
    },
    [history]
  );

  const getFirstAIResponse = (conversation: MessagesState) =>
    sortConversation(conversation).find((msg) => msg.type === "ai");

  return (
    <Drawer
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      renderDrawerContent={() => (
        <View className="flex-1 bg-[#E0E0E0]">
          <View className="bg-secondary p-4 rounded-b-2xl justify-center items-center">
            <Text className="text-lg font-bold text-primary">AcadMate AI</Text>
          </View>
          <Text className="text-base font-bold text-secondary border-b border-secondary m-4">
            Chats
          </Text>
          {loading ? (
            <View className="flex-1 justify-center items-center">
              <ActivityIndicator size="large" color="#005596" />
            </View>
          ) : history.length === 0 ? (
            <View className="flex-1 justify-start items-center">
              <Text className="text-lg font-semibold text-secondary">
                No History
              </Text>
            </View>
          ) : (
            <ScrollView showsVerticalScrollIndicator={false}>
              {history.map((item, index) => {
                const firstAIMessage = getFirstAIResponse(item.conversation);
                return firstAIMessage ? (
                  <TouchableOpacity
                    key={index}
                    activeOpacity={0.5}
                    onPress={() => getHistory(index)}
                  >
                    <ChatHistory title={firstAIMessage.text} />
                  </TouchableOpacity>
                ) : null;
              })}
            </ScrollView>
          )}
        </View>
      )}
    >
      <Header
        onPress={() => handleBackPress()}
        onPressEdit={handleClearChat}
        onPressMenu={() => setOpen(true)}
      />
      <CustomModal
        visible={visible}
        onOk={() => {
          setVisible(false);
          router.back();
        }}
        onCancel={() => {
          setVisible(false);
          router.back();
        }}
      >
        <View className="px-20">
          <Image
            source={require("@/assets/images/no-internet.png")}
            style={{ width: 90, height: 90 }}
          />
        </View>
        <Text className="text-lg text-red-500 font-bold">
          No Internet connection!
        </Text>
      </CustomModal>
      <ChatComponent messages={messages} setMessages={setMessages} />
    </Drawer>
  );
}
