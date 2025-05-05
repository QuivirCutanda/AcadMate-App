import { View, Text, TextInput, Alert } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import Header from "@/src/components/flashcard/Header";
import Modal from "@/src/components/AnimatedModal";
import { getNoteByID, updateNote } from "@/src/database/notes/NotesQuery";
import useBackHandler from "@/src/hooks/useBackHandler";

interface Note {
  id?: number;
  userId: number;
  title: string;
  content: string;
  tags?: string;
  isPinned?: boolean;
  created_at?: string;
  updated_at?: string;
}

const viewNotes = () => {
  const router = useRouter();
  const { notesId } = useLocalSearchParams();
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [date, setDate] = useState<string | undefined>();
  useFocusEffect(
    useCallback(() => {
      const fetchNote = async () => {
        const data: Note | null = await getNoteByID(Number(notesId));
        if (data) {
          setTitle(data.title);
          setContent(data.content);
          setDate(data.created_at);
        }
      };
      fetchNote();
      console.log("notes ID :", notesId);
    }, [notesId])
  );
  useBackHandler(() => {
    handleUpdateNote();
    router.back();
    setTitle("");
    setContent("");
    return true;
  });

  const handleUpdateNote = async () => {
    if (title.trim() != "" || content.trim() != "") {
      const success = await updateNote(Number(notesId), {
        userId: 1,
        title,
        content,
      });
    }
  };

  return (
    <View className="flex-1 bg-background-ligth">
      <Header
        onPress={() => {
          handleUpdateNote();
          router.back();
        }}
        title="Notes"
      />

      <View>
        <TextInput
          className="m-4 text-xl font-semibold text-secondary placeholder:text-secondary/50"
          placeholder="Title"
          value={title}
          onChangeText={setTitle}
          selectionColor="#005596"
          multiline
          textAlignVertical="top"
          numberOfLines={10}
          style={{ minHeight: 40 }}
        />
        <Text className="ml-4 text-sm text-secondary">
          {date} | {content.length} characters
        </Text>
        <TextInput
          className="m-4 text-base font-normal text-secondary placeholder:text-secondary/50"
          placeholder="Start typing"
          value={content}
          onChangeText={setContent}
          selectionColor="#005596"
          multiline
          textAlignVertical="top"
          numberOfLines={10}
          style={{ minHeight: 600 }}
        />
      </View>
    </View>
  );
};

export default viewNotes;
