import { Mistral } from "@mistralai/mistralai";
import {config} from "@/environments/development/config";

const apiKey = config.MISTRAL_API_KEY;
const client = new Mistral({ apiKey });

export const AIResponse = async (input: string) => {
  if (!input.trim()) return { error: "Input cannot be empty" };

  try {
    const chatResponse = await client.chat.complete({
      model: "mistral-large-latest",
      messages: [{ role: "user", content: input }],
    });

    if (chatResponse.choices?.length) {
      const content = chatResponse.choices[0].message.content;
      if (typeof content === "string") {
        return { response: content };
      }
      return { error: "Invalid response format" };
    }

    return { error: "No response received" };
  } catch (err) {
    console.error("Chat API Error:", err);
    return { error: "Error fetching response" };
  }
};
