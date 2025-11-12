
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // In a real app, you might want to handle this more gracefully.
  // For this example, we'll throw an error if the key is missing.
  // The environment is expected to provide this key.
  console.warn("API_KEY environment variable not set. Gemini API calls will fail.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export const generateWelcomeMessage = async (roomName: string, location: string): Promise<string> => {
  if (!API_KEY) {
    return `Welcome! We're excited for you to stay at ${roomName} in beautiful ${location}. Enjoy your trip! (This is a sample message as API key is not configured).`;
  }
  
  const prompt = `Generate a short, friendly, and welcoming message for a guest who just booked a room.
  The message should be about 3-4 sentences long.
  
  Details:
  - Room Name: "${roomName}"
  - Location: "${location}"
  
  Tone: Warm, hospitable, and slightly excited.
  Mention one unique hypothetical positive aspect of the location. For example, if it's in Paris, mention the charming streets. If it's in Bali, mention the serene beaches.
  
  Example: "Welcome to [Room Name]! We are thrilled to host you in the heart of [Location]. Get ready to explore the [unique aspect]. We've prepared everything for your comfortable stay. See you soon!"
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text.trim();
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    // Provide a graceful fallback message
    return `Welcome! We are so excited for you to stay at ${roomName} in beautiful ${location}. We've made sure everything is perfect for your arrival. Enjoy your trip!`;
  }
};


export const findNearbyPlaces = async (latitude: number, longitude: number): Promise<{ text: string, groundingMetadata: any[] }> => {
  if (!API_KEY) {
    throw new Error("API_KEY environment variable not set.");
  }

  const prompt = `Using my current location, find the following points of interest: the nearest shops for goods, the 3 nearest General Practitioner (GP) clinics, the nearest hospital or clinic, the nearest park for recreation, and the nearest police station. For each, provide the name and address. Present the results clearly, grouped by category.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{googleMaps: {}}],
        toolConfig: {
          retrievalConfig: {
            latLng: {
              latitude: latitude,
              longitude: longitude
            }
          }
        }
      },
    });
    
    return {
      text: response.text,
      groundingMetadata: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    };
  } catch (error) {
    console.error("Error calling Gemini API with Maps grounding:", error);
    throw new Error("Could not fetch nearby places. Please try again later.");
  }
};