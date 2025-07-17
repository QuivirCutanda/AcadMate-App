import React from "react";
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

  const copyToClipboard = async (content: string) => {
    await Clipboard.setStringAsync(content.trim());
    ToastAndroid.show("Copied to clipboard!", ToastAndroid.SHORT);
  };

  const removeNumbering = (text: string) => {
    return text.replace(/^\d+\.\s*/, "");
  };

  const formatText = (text: string) => {
    // Handle headers (# ## ### #### ##### ######)
    let formattedText = text.replace(/^(#{1,6})\s+(.*?)$/gm, (match, hashes, content) => {
      return `**${content.trim()}**\n`;
    });

    // Handle bold text (**text**)
    const parts = formattedText.split(/\*\*(.*?)\*\*/g);
    const elements: React.ReactNode[] = [];
    
    parts.forEach((part, index) => {
      if (index % 2 === 1) {
        // Bold text
        elements.push(
          <Text key={index} style={{ fontWeight: "bold" }}>
            {part}
          </Text>
        );
      } else {
        // Regular text - handle line breaks and lists
        const lines = part.split('\n');
        lines.forEach((line, lineIndex) => {
          // Handle bullet points (- or *)
          if (line.trim().match(/^[-*]\s+/)) {
            elements.push(
              <Text key={`${index}-${lineIndex}`}>
                {lineIndex > 0 && '\n'}• {line.trim().replace(/^[-*]\s+/, '')}
              </Text>
            );
          }
          // Handle numbered lists (1. 2. etc.)
          else if (line.trim().match(/^\d+\.\s+/)) {
            const number = line.trim().match(/^(\d+)\.\s+/)?.[1];
            elements.push(
              <Text key={`${index}-${lineIndex}`}>
                {lineIndex > 0 && '\n'}{number}. {line.trim().replace(/^\d+\.\s+/, '')}
              </Text>
            );
          }
          // Regular line
          else if (line.trim()) {
            elements.push(
              <Text key={`${index}-${lineIndex}`}>
                {lineIndex > 0 && '\n'}{line}
              </Text>
            );
          }
          // Empty line (preserve spacing)
          else if (lineIndex > 0) {
            elements.push(
              <Text key={`${index}-${lineIndex}`}>{'\n'}</Text>
            );
          }
        });
      }
    });

    return elements;
  };

  return (
    <View
      className={`p-4 m-2 rounded-lg ${
        type === "user"
          ? "max-w-[80%] bg-secondary self-end m-4"
          : "w-full self-start pr-8 mb-4"
      }`}
    >
      {parts.map((part, index) =>
        index % 2 === 1 ? (
          <CodeSyntaxFormatter key={index} code={part} />
        ) : (
          <TouchableWithoutFeedback
            key={index}
            onLongPress={() => copyToClipboard(part)}
          >
            <View>
              <Text
                className={`${type === "user"
          ? "text-primary": "text-black"} leading-6`}
                style={{ lineHeight: 24 }}
              >
                {formatText(removeNumbering(part))}
              </Text>
            </View>
          </TouchableWithoutFeedback>
        )
      )}
    </View>
  );
};

export default ChatBubble;