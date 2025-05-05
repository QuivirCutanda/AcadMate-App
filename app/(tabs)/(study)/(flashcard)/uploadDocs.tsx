import React, { useState } from "react";
import {
  View,
  Text,
  Button,
  ScrollView,
  ActivityIndicator,
  Alert,
  TextInput,
} from "react-native";
import DocumentPicker from "react-native-document-picker";
import useExtractText from "@/src/hooks/useExtractText";
import Header from "@/src/components/flashcard/Header";

const DocumentTextExtractor = () => {
  const { text, loading, error, extractTextFromFile } = useExtractText();
  const [fileName, setFileName] = useState<string | null>(null);
  const [deckName,setDeckName] = useState("");
  const handlePickDocument = async () => {
    try {
      const res = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.plainText, DocumentPicker.types.docx],
      });

      if (res && res.uri) {
        setFileName(res.name);
        extractTextFromFile(res.uri);
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        Alert.alert("Cancelled", "You did not select any document.");
      } else {
        Alert.alert("Error", "An error occurred while picking the document.");
      }
    }
  };

  return (
    <View className="flex-1 bg-background-ligth">
      <Header onPress={() => {}} title="Upload Docs" />
      <TextInput
        className="m-4 text-xl font-semibold text-secondary placeholder:text-secondary/50"
        placeholder="Title"
        value={deckName}
        onChangeText={(text) => setDeckName(text)}
        selectionColor="#005596"
        multiline
        textAlignVertical="top"
        numberOfLines={10}
        style={{ minHeight: 40 }}
        returnKeyType="done"
      />
      <Text>{deckName}</Text>
      <Button
        title="Pick Document & Extract Text"
        onPress={handlePickDocument}
      />
      {loading && (
        <ActivityIndicator
          size="large"
          color="blue"
          style={{ marginTop: 10 }}
        />
      )}
      {fileName && (
        <Text style={{ marginTop: 10, fontWeight: "bold" }}>📄 {fileName}</Text>
      )}
      {error && <Text style={{ color: "red", marginTop: 10 }}>{error}</Text>}
      {text && (
        <ScrollView
          style={{
            marginTop: 10,
            padding: 10,
            backgroundColor: "#f0f0f0",
            borderRadius: 5,
          }}
        >
          <Text>{text}</Text>
        </ScrollView>
      )}
    </View>
  );
};

export default DocumentTextExtractor;