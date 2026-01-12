import { GoogleGenAI } from "@google/genai";
import { GraduationOptions } from "../types";

const MODEL_NAME = 'gemini-3-pro-image-preview';

/**
 * Checks if the user has selected an API key via the AI Studio overlay.
 * If not, prompts the user to select one.
 */
export const ensureApiKey = async (): Promise<boolean> => {
  const w = window as any;
  if (w.aistudio && w.aistudio.hasSelectedApiKey && w.aistudio.openSelectKey) {
    const hasKey = await w.aistudio.hasSelectedApiKey();
    if (!hasKey) {
      await w.aistudio.openSelectKey();
      // Assume success after dialog closes (race condition mitigation)
      return true;
    }
    return true;
  }
  // If window.aistudio is not present, we assume we might be in a dev env or key is already in env
  return !!process.env.API_KEY;
};

export const generateGraduationPhoto = async (
  imageBase64: string,
  options: GraduationOptions
): Promise<string> => {
  // Ensure we have a key before starting
  await ensureApiKey();

  // Initialize client with the (potentially newly selected) key
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // Clean base64 string
  const base64Data = imageBase64.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, '');

  const prompt = `
    ACT AS: "Graduation Photo Generator v2.0". 
    TASK: Generate a high-quality graduation photo based on the uploaded image.
    
    [CRITICAL INSTRUCTION - IDENTITY LOCK]
    Use the EXACT same face from the uploaded photo. Do NOT change ANY facial features. Lock onto every pixel of the face.
    - Eyes, Nose, Mouth, Eyebrows: Must be 100% identical to the original.
    - Skin texture, moles, scars: Preserve perfectly.
    - Facial shape, jawline: Do NOT slim or alter.
    - Expression: Keep the exact original expression.
    - DO NOT BEAUTIFY OR "FIX" THE FACE. It must look like the EXACT same person.

    [RENDERING DETAILS]
    1. SUBJECT: The person in the photo wearing a graduation gown and cap (mortarboard).
       - School Level: ${options.schoolLevel} (Adjust cap/gown size and style appropriately).
       - Gown Color: ${options.gownColor}.
       - Cap: Matching the gown, sitting naturally on the head. Tassel visible.
    
    2. BACKGROUND: ${options.background}.
       - If it's a solid color, make it professional studio lighting.
       - If it's a theme (like Cherry Blossom), apply a soft blur for depth.
    
    3. CONFETTI: ${options.confetti}
       ${options.confetti !== '없음' ? '- Scattered naturally in the background. DO NOT cover the face.' : '- No confetti.'}
    
    4. TEXT: 
       ${options.customText ? `- elegantly written at the bottom center: "${options.customText}"` : '- No text overlay.'}
    
    5. STYLE: Professional Studio Photography. High resolution, sharp focus on eyes, soft flattering lighting.
    
    6. ASPECT RATIO: 2:3 Portrait.
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: {
        parts: [
          {
            text: prompt,
          },
          {
            inlineData: {
              mimeType: 'image/png', // Assuming PNG for simplicity, Gemini handles common formats
              data: base64Data,
            },
          },
        ],
      },
      config: {
        imageConfig: {
            aspectRatio: "3:4", // Closest to 2:3 available in standard configs, cropping can be done if needed
            imageSize: "1K"
        }
      }
    });

    // Extract image from response
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData && part.inlineData.data) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    
    throw new Error("No image generated.");
  } catch (error: any) {
    console.error("Gemini Generation Error:", error);
    // Handle the specific "Requested entity was not found" error for API keys
    if (error.message && error.message.includes("Requested entity was not found")) {
         const w = window as any;
         if (w.aistudio && w.aistudio.openSelectKey) {
             await w.aistudio.openSelectKey();
             throw new Error("API Key issue detected. Please re-select your key and try again.");
         }
    }
    throw error;
  }
};
