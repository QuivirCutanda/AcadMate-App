import { View, Text, TextInput, Button, TouchableOpacity } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import Header from "@/src/components/flashcard/Header";
import { insertNote } from "@/src/database/notes/NotesQuery";
import useBackHandler from "@/src/hooks/useBackHandler";
import { Ionicons } from "@expo/vector-icons";

const createNotes = () => {
  const router = useRouter();
  const { notesId } = useLocalSearchParams();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [noteId, setNoteId] = useState<number | null>(null);
  const [currentTime, setCurrentTime] = useState("");
  const [history, setHistory] = useState<{ title: string; content: string }[]>(
    []
  );
  const [redoStack, setRedoStack] = useState<
    { title: string; content: string }[]
  >([]);

  useFocusEffect(
    useCallback(() => {
      setNoteId(Number(notesId));
      console.log("Note ID: ", noteId);
    }, [])
  );

  useEffect(() => {
    setNoteId(Number(notesId));
    console.log("Note ID: ", noteId);
  }, []);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const formattedTime = now.toLocaleString("en-US", {
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
      setCurrentTime(formattedTime);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  useBackHandler(() => {
    addNewNote();
    router.back();
    setTitle("");
    setContent("");
    return true;
  });

  const addNewNote = async () => {
    const newNote = { userId: 1, title, content };
    if (title.trim() !== "") {
      const noteId = await insertNote(newNote);
      noteId
        ? console.log(`New note added successfully with ID: ${noteId}`)
        : console.log("Failed to insert note.");
    }
  };

  const handleInputChange = (newTitle: string, newContent: string) => {
    setHistory([...history, { title, content }]);
    setTitle(newTitle);
    setContent(newContent);
    setRedoStack([]);
  };

  const undo = () => {
    if (history.length > 0) {
      const previousState = history.pop();
      setRedoStack([...redoStack, { title, content }]);
      setTitle(previousState?.title || "");
      setContent(previousState?.content || "");
    }
  };

  const redo = () => {
    if (redoStack.length > 0) {
      const nextState = redoStack.pop();
      setHistory([...history, { title, content }]);
      setTitle(nextState?.title || "");
      setContent(nextState?.content || "");
    }
  };

  return (
    <View className="flex-1 bg-background-light">
      <Header
        onPress={() => {
          addNewNote();
          router.back();
          setTitle("");
          setContent("");
        }}
        title="Notes"
      />
      {/* <View className="flex-row justify-end gap-6 px-4 pt-4 absolute top-0 right-0">
        <TouchableOpacity onPress={redo} disabled={redoStack.length === 0} className="bg-background-ligth p-2 rounded-full">
          <Ionicons name="arrow-undo" size={18} color="#005596" />
        </TouchableOpacity>
        <TouchableOpacity onPress={undo} disabled={history.length === 0} className="bg-background-ligth p-2 rounded-full">
          <Ionicons name="arrow-redo" size={18} color="#005596" />
        </TouchableOpacity>
      </View> */}
      <View className="flex-1 bg-background-ligth">
        <TextInput
          className="m-4 text-xl font-semibold text-secondary placeholder:text-secondary/50"
          placeholder="Title"
          value={title}
          onChangeText={(text) => handleInputChange(text, content)}
          selectionColor="#005596"
          multiline
          textAlignVertical="top"
          numberOfLines={10}
          style={{ minHeight: 40 }}
          returnKeyType="done"
        />
        <Text className="ml-4 text-sm text-secondary">
          {currentTime} | {content.length} characters
        </Text>
        <TextInput
          className="m-4 text-base font-normal text-secondary placeholder:text-secondary/50 flex-1"
          placeholder="Start typing"
          value={content}
          onChangeText={(text) => handleInputChange(title, text)}
          selectionColor="#005596"
          multiline
          returnKeyType="done"
          onSubmitEditing={addNewNote}
          textAlignVertical="top"
          numberOfLines={10}
          style={{ minHeight: 60 }}
        />
      </View>
    </View>
  );
};

export default createNotes;
