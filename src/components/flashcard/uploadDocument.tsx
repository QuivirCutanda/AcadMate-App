import { View, Text, TouchableOpacity, Alert } from "react-native";
import React, { useState, useEffect } from "react";
import TextInput from "@/src/components/CustomTextInput";
import DocumentPicker from "react-native-document-picker";
import useExtractText from "@/src/hooks/useExtractText";
import Generating from "@/assets/animation/AIGC-Generating.json";
import { AIResponse } from "@/src/AI/utils/chatHelper";
import LottieView from "lottie-react-native";
import success from "@/assets/animation/Successful.json";

import {
  insertDeck,
  insertFlashcardItem,
} from "@/src/database/FashcardQueries";

interface uploadDocumentProps {
  onDone: (isDone: boolean) => void;
}

export default function UploadDocument({ onDone }: uploadDocumentProps) {
  const { text, error, extractTextFromFile } = useExtractText();
  const [fileName, setFileName] = useState<string>("");
  const [cardTitle, setCardTitle] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [flashcardData, setFlashcardData] = useState<any>(null);

  const handlePickDocument = async () => {
    try {
      const res = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.plainText, DocumentPicker.types.docx],
      });

      if (res && res.uri) {
        setFileName(res.name || "Untitled Document");
        setLoading(true);
        await extractTextFromFile(res.uri);
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        Alert.alert("Cancelled", "You did not select any document.");
        onDone(false);
      } else {
        Alert.alert("Error", "An error occurred while picking the document.");
        onDone(false);
      }
    }
  };

  useEffect(() => {
    handlePickDocument();
  }, []);

  useEffect(() => {
    const summarizeText = async () => {
      if (text && text.length > 0) {
        try {
          const prompt = `
You are an AI assistant that creates flashcards from study materials.

Please generate a JSON response with the following format:
{
  "deckName": "${fileName || "Untitled Flashcard Deck"}",
  "description": "A set of flashcards based on the uploaded document.",
  "flashcards": [
    {
      "id": 1,
      "question": "...",
      "answer": "..."
    }
  ]
}

Here is the document content:
${text}
`;

          console.log("🧠 Sending prompt to AI...");
          const { response } = await AIResponse(prompt);
          console.log("🧠 AI Response: ", response);

          const cleanedResponse = response
            .trim()
            .replace(/^```json\s*|\s*```$/g, "");

          const parsedResponse = JSON.parse(cleanedResponse);

          if (!parsedResponse.flashcards) {
            throw new Error("Parsed response does not contain flashcards");
          }

          console.log("📘 Generated Flashcard JSON:\n", parsedResponse);
          setFlashcardData(parsedResponse);
        } catch (err) {
          console.error("❌ Error during AI summarization:", err);
          Alert.alert("AI Error", "Failed to generate flashcards.");
        } finally {
          setLoading(false);
        }
      }
    };

    summarizeText();
  }, [text]);

  useEffect(() => {
    const GenerateFlashCard = async () => {
      if (!flashcardData) return;

      try {
        const deckId = await insertDeck({
          userId: 1,
          title: flashcardData.deckName,
          description: flashcardData.description,
          isImportant: false,
        });

        if (!deckId) {
          console.error("Failed to insert the deck.");
          return;
        }

        for (const flashcard of flashcardData.flashcards) {
          const success = await insertFlashcardItem(
            deckId,
            flashcard.question,
            flashcard.answer
          );

          if (!success) {
            onDone(false)
          }
        }

        console.log("✅ Generated flashcards inserted successfully!");
        onDone(false)
        Alert.alert("Success", "Flashcards inserted successfully!");
      } catch (error) {
        onDone(false)
        // console.error("❌ Error inserting Flashcard Table deck:", error);
        Alert.alert("Database Error", "Failed to insert flashcards.");
      }
    };

    GenerateFlashCard();
  }, [flashcardData]);

  return (
    <View className="w-full">
      <LottieView
        source={Generating}
        autoPlay
        loop={true}
        style={{ width: 100, height: 100, alignSelf: "center", marginTop: 20 }}
      />
      <Text className="text-secondary font-bold text-lg text-center p-4">
        Generating Flashcard...
      </Text>
    </View>
  );
}
