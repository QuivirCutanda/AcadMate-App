import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import Header from "@/src/components/flashcard/Header";
import NotesCard from "@/src/components/notes/notesCard";
import Button from "@/src/components/flashcard/NewDeckButton";
import BottomSheet from "@/src/components/CustomBottomSheet";
import Snackbar from "@/src/components/CustomSnackbar";

import { useFocusEffect, useRouter } from "expo-router";
import useBackHandler from "@/src/hooks/useBackHandler";

import {
  insertNote,
  getAllNotes,
  dbEventEmitter,
} from "@/src/database/notes/NotesQuery";
import { Entypo } from "@expo/vector-icons";
import MenuItem from "@/src/components/flashcard/MenuItem";
import {
  deleteNote,
  subscribeToNoteUpdates,
} from "@/src/database/notes/NotesQuery";

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

const index = () => {
  const router = useRouter();
  const [visibleBottomsheet, setVisibleBottomsheet] = useState<boolean>(false);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [notes, setNotes] = useState<Note[] | null>(null);
  const [noteId, setNoteId] = useState<number | null>(null);

  useFocusEffect(
    useCallback(() => {
      fetchNotes();
    }, [])
  );

  const fetchNotes = async () => {
    const data = await getAllNotes();
    setNotes(data);
  };

  
  useEffect(() => {
    const unsubscribe = subscribeToNoteUpdates(fetchNotes);
    return () => unsubscribe();
  }, [noteId]);


  const openBottomSheet = useCallback(() => {
    setVisibleBottomsheet(true);
  }, []);

  const closeBottomSheet = useCallback(() => {
    setVisibleBottomsheet(false);
  }, []);

  useBackHandler(() => {
    if (visibleBottomsheet) {
      closeBottomSheet();
      return true;
    }
    setVisibleBottomsheet(false);
    router.back();
    return true;
  });

  const handleDelete = async () => {
    if (noteId !== null) {
      await deleteNote(Number(noteId));
      closeBottomSheet();
      setSnackbarOpen(true);
      setNoteId(null)
    }
  };

  // Call the function to insert a note
  // addNewNote();

  return (
    <View className="flex-1 bg-background-ligth">
      <Header onPress={() => router.back()} title="Notes" />
      <ScrollView className="flex-1 p-4">
        {notes?.map((card, index) => (
          <NotesCard
            key={index}
            onDelete={() => {
              setNoteId(Number(card.id));
              openBottomSheet();
            }}
            onPress={() => {
              router.push(`/viewNotes`);
              router.setParams({ notesId: card.id });
            }}
            title={card.title}
            content={card.content}
            date={String(card.created_at)}
          />
        ))}
        <View className="mb-24"></View>
      </ScrollView>
      <Button
        className="border-primary border rounded-full"
        onPress={() => {
          router.push(`/createNotes`);
        }}
      />
      {visibleBottomsheet && (
        <TouchableOpacity
          onPress={closeBottomSheet}
          className="bg-secondary/30 absolute h-full w-full"
        >
          <BottomSheet
            isVisible={visibleBottomsheet}
            onClose={() => {
              closeBottomSheet();
            }}
            snapPoint="15"
          >
            <View className="px-4 pt-4 mt-2">
              <MenuItem
                label="remove"
                Icon={Entypo}
                iconName="trash"
                iconColor="red"
                textColor="text-red-600"
                onPress={() => {
                  handleDelete();
                  closeBottomSheet();
                  openBottomSheet();
                }}
              />
            </View>
          </BottomSheet>
        </TouchableOpacity>
      )}
      <Snackbar
        message="Notes added"
        visible={snackbarOpen}
        onDismiss={() => {
          setSnackbarOpen(false);
        }}
        backgroundColor="red"
      />
    </View>
  );
};

export default index;
