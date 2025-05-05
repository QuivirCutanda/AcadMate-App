import { useState } from "react";
import RNFS from "react-native-fs";
import Mammoth from "mammoth";
import { Platform } from "react-native";
import { decode as atob } from "base-64"; // Ensure you have installed 'base-64' package

const useExtractText = () => {
  const [text, setText] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const extractTextFromFile = async (filePath: string) => {
    setLoading(true);
    setError(null);
    try {
      const fileExt = filePath.split(".").pop()?.toLowerCase();
      if (!fileExt) throw new Error("Invalid file format");

      let extractedText = "";

      if (fileExt === "txt") {
        // Read plain text file
        extractedText = await RNFS.readFile(filePath, "utf8");
      } else if (fileExt === "docx") {
        // Read DOCX file and convert Base64 to ArrayBuffer
        const base64Data = await RNFS.readFile(filePath, "base64");
        const binaryString = atob(base64Data);
        const byteArray = new Uint8Array(binaryString.length);

        for (let i = 0; i < binaryString.length; i++) {
          byteArray[i] = binaryString.charCodeAt(i);
        }

        const result = await Mammoth.extractRawText({ arrayBuffer: byteArray.buffer });
        extractedText = result.value;
      } else {
        throw new Error("Unsupported file format");
      }

      setText(extractedText);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { text, loading, error, extractTextFromFile };
};

export default useExtractText;
