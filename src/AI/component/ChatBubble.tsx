import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableWithoutFeedback,
  ToastAndroid,
} from "react-native";
import CodeSyntaxFormatter from "./CodeSyntaxFormatter";
import * as Clipboard from "expo-clipboard";

interface ChatBubbleProps {
  text: string;
  type: "user" | "ai";
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ text, type }) => {
  const codeBlockRegex = /```([\s\S]+?)```/g;

  const parts = text ? text.split(codeBlockRegex) : [];

  const [displayedParts, setDisplayedParts] = useState<string[]>(() =>
    type === "user" ? parts : Array(parts.length).fill("")
  );

  useEffect(() => {
    if (type === "ai") {
      let index = 0;
      const newParts = [...displayedParts];

      const typeText = async (partIndex: number) => {
        const fullText = parts[partIndex];
        let i = 0;
        const speed = 3;

        return new Promise<void>((resolve) => {
          const interval = setInterval(() => {
            newParts[partIndex] = fullText.slice(0, i);
            setDisplayedParts([...newParts]);
            i += speed;

            if (i > fullText.length) {
              newParts[partIndex] = fullText;
              setDisplayedParts([...newParts]);
              clearInterval(interval);
              resolve();
            }
          }, 30);
        });
      };

      const startTyping = async () => {
        for (let i = 0; i < parts.length; i++) {
          await typeText(i);
        }
      };

      startTyping();
    }
  }, [text, type]);

  const copyToClipboard = async (content: string) => {
    await Clipboard.setStringAsync(content.trim());
    ToastAndroid.show("Copied to clipboard!", ToastAndroid.SHORT);
  };

  const removeNumbering = (text: string) => {
    return text.replace(/^\d+\.\s*/, "");
  };

  const formatBoldText = (text: string) => {
    const parts = text.split(/\*\*(.*?)\*\*/g);
    return parts.map((part, index) => {
      if (index % 2 === 1) {
        return (
          <Text
            key={index}
            style={{ fontWeight: "bold" }}
            className="text-base"
          >
            {part}
          </Text>
        );
      } else {
        return part;
      }
    });
  };

  const handleTextFormatting = (text: string) => {
    const modifiedText = text.replace(/###\s*(.*?)(\n|$)/g, (_, match) => {
      return `**${match.trim()}**`;
    });

    return formatBoldText(modifiedText);
  };

  return (
    <View
      className={`p-2 m-2 rounded-lg ${
        type === "user"
          ? "max-w-[80%] bg-secondary self-end m-4"
          : displayedParts.some((part) => part.length > 0)
          ? "w-full self-start pr-8"
          : ""
      }`}
    >
      {displayedParts.map((part, index) =>
        index % 2 === 1 ? (
          part.length > 0 ? (
            <CodeSyntaxFormatter key={index} code={part} />
          ) : null
        ) : (
          <TouchableWithoutFeedback
            key={index}
            onLongPress={() => copyToClipboard(part)}
          >
            <View>
              <Text
                className={`${type === "user"
          ? "text-primary": "text-black"}`}
              >
                {handleTextFormatting(removeNumbering(part))}
              </Text>
            </View>
          </TouchableWithoutFeedback>
        )
      )}
    </View>
  );
};

export default ChatBubble;
