import { Injectable } from '@angular/core';
import { GoogleGenAI, GenerateContentResponse } from '@google/genai';

@Injectable({
  providedIn: 'root'
})
export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env['GEMINI_API_KEY'] || '' });
  }

  async generateStoryStream(prompt: string): Promise<AsyncIterable<GenerateContentResponse>> {
    try {
      const response = await this.ai.models.generateContentStream({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          systemInstruction: 'You are a creative and engaging storyteller. Format your stories with clear paragraphs.',
        }
      });
      return response;
    } catch (error) {
      console.error('Error generating story:', error);
      throw error;
    }
  }

  async analyzeImage(base64Image: string, prompt: string): Promise<string> {
    try {
      const imagePart = {
        inlineData: {
          mimeType: 'image/png', // Assuming PNG or JPEG, GenAI handles standard types well
          data: base64Image
        }
      };
      
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: {
          role: 'user',
          parts: [
            imagePart,
            { text: prompt || 'Describe this image in detail.' }
          ]
        }
      });

      return response.text || 'No analysis available.';
    } catch (error) {
      console.error('Error analyzing image:', error);
      throw error;
    }
  }

  async generateImage(prompt: string, aspectRatio: '1:1' | '16:9' | '4:3' = '1:1'): Promise<string> {
    try {
      const response = await this.ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: prompt,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/jpeg',
          aspectRatio: aspectRatio
        }
      });
      
      const base64ImageBytes = response.generatedImages?.[0]?.image?.imageBytes;
      if (base64ImageBytes) {
        return `data:image/jpeg;base64,${base64ImageBytes}`;
      }
      throw new Error('No image generated');
    } catch (error) {
      console.error('Error generating image:', error);
      throw error;
    }
  }
}