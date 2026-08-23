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

export const evaluateInterview = async (
  role: string,
  difficulty: string,
  questions: {
    question: string;
    answer?: string;
  }[]
) => {
  const prompt = `
You are an expert technical interviewer.

Evaluate the candidate's answers for a mock technical interview.

Role: ${role}
Difficulty: ${difficulty}

For each question, evaluate the candidate's answer based on:
- Technical correctness
- Understanding of the concept
- Completeness
- Clarity

Give each answer a score from 0 to 10.

Questions and answers:

${questions
  .map(
    (item, index) => `
Question ${index + 1}:
${item.question}

Candidate Answer:
${item.answer || 'No answer provided'}
`
  )
  .join('\n')}

Return ONLY valid JSON in this exact format:

{
  "evaluations": [
    {
      "questionNumber": 1,
      "score": 8,
      "feedback": "The candidate demonstrated a good understanding of the concept."
    }
  ],
  "overallScore": 8,
  "overallFeedback": "The candidate demonstrated a solid understanding of the core concepts."
}

Rules:
- score must be a number from 0 to 10.
- overallScore must be a number from 0 to 10.
- Provide one evaluation for every question.
- Do not include markdown.
- Do not include code fences.
- Return only JSON.
`;

  const response = await ai.models.generateContent({
    model: 'gemini-3.6-flash',
    contents: prompt,
  });

  const text = response.text;

  if (!text) {
    throw new Error('AI returned an empty response');
  }

  try {
    const evaluation = JSON.parse(text);

    console.log('AI evaluation:', JSON.stringify(evaluation, null, 2));

    return evaluation;
  } catch (error) {
    console.error('Failed to parse AI evaluation:', text);
    throw new Error('AI returned invalid JSON');
  }
};
