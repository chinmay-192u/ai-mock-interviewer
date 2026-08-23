import 'dotenv/config';
import { GoogleGenAI } from '@google/genai';

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error('GEMINI_API_KEY is not defined');
}

const ai = new GoogleGenAI({
  apiKey,
});

export const generateInterviewQuestions = async (
  role: string,
  difficulty: string,
  count: number = 5
) => {
  const prompt = `
You are an AI interviewer.

Generate ${count} interview questions for the following candidate:

Role: ${role}
Difficulty: ${difficulty}

Return ONLY a JSON array.

Each question should have:
- question
- difficulty
- topic

Example:
[
  {
    "question": "What is polymorphism in Java?",
    "difficulty": "medium",
    "topic": "OOP"
  }
]
`;

  const response = await ai.models.generateContent({
    model: 'gemini-3.6-flash',
    contents: prompt,
  });

  const text = response.text;

  if (!text) {
    throw new Error('AI returned an empty response');
  }

  const questions = JSON.parse(text);

  return questions;
};
