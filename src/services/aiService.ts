import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function parseSurveyReport(content: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Extract key community needs and data points from the following survey report text. 
      Return a JSON array of objects with the following structure:
      {
        "title": "Brief title of the need",
        "description": "Short description",
        "category": "One of: FOOD, HEALTH, EDUCATION, SHELTER, ENVIRONMENT, OTHER",
        "urgencyLevel": "One of: LOW, MEDIUM, HIGH, CRITICAL",
        "location": "A string describing the location if found",
        "dataPoints": { "key": "value" }
      }
      
      Report text:
      ${content}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              category: { type: Type.STRING },
              urgencyLevel: { type: Type.STRING },
              location: { type: Type.STRING },
              dataPoints: { type: Type.OBJECT }
            },
            required: ["title", "description", "category", "urgencyLevel"]
          }
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Error parsing survey with Gemini:", error);
    throw error;
  }
}
