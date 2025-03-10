import React, { useState, useEffect } from "react";
import { AIResponse } from "@/src/AI/utils/chatHelper";
import ChatUI from "@/src/AI/component/ChatUI";

interface Message {
  text: string;
  type: "user" | "ai";
}

const ChatComponent: React.FC<{ onClearChat: (clearFn: () => void) => void }> = ({ onClearChat }) => {
  const [input, setInput] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    onClearChat(() => () => setMessages([]));
  }, [onClearChat]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage: Message = { text: input, type: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    const { response, error } = await AIResponse(input);
    if (response) {
      setMessages((prev) => [...prev, { text: response, type: "ai" }]);
    } else if (error) {
      setMessages((prev) => [...prev, { text: "Error: " + error, type: "ai" }]);
    }

    setLoading(false);
  };

  return <ChatUI input={input} setInput={setInput} messages={messages} handleSend={handleSend} loading={loading} />;
};

export default ChatComponent;
