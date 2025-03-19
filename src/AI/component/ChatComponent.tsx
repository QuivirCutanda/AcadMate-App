import React, { useState, useEffect } from "react";
import { AIResponse } from "@/src/AI/utils/chatHelper";
import ChatUI from "@/src/AI/component/ChatUI";

interface Message {
  text: string;
  type: "user" | "ai";
}

interface MessagesState {
  [key: string]: Message;
}

const ChatComponent: React.FC<{
  messages: MessagesState;
  setMessages: React.Dispatch<React.SetStateAction<MessagesState>>;
}> = ({ messages, setMessages }) => {
  const [input, setInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const generateMessageId = () => `msg-${Date.now()}`;

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const messageId = generateMessageId();
    const userMessage: Message = { text: input, type: "user" };
    
    setMessages((prev) => ({ ...prev, [messageId]: userMessage }));
    setInput("");
    setLoading(true);

    const { response, error } = await AIResponse(input);
    const aiMessageId = generateMessageId();
    
    if (response) {
      setMessages((prev) => ({ ...prev, [aiMessageId]: { text: response, type: "ai" } }));
    } else if (error) {
      setMessages((prev) => ({ ...prev, [aiMessageId]: { text: "Error: " + error, type: "ai" } }));
    }

    setLoading(false);
  };

  return (
    <ChatUI
      input={input}
      setInput={setInput}
      messages={Object.values(messages)}
      handleSend={handleSend}
      loading={loading}
    />
  );
};

export default ChatComponent;