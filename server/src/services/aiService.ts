import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const generateStudyPlan = async (userData: any, goals: string, availability: number) => {
    const prompt = `
        As an expert AI Study Mentor, generate a highly personalized study plan for a student with the following details:
        User Level: ${userData.currentLevel}
        Weak Subjects: ${userData.weakSubjects.join(", ")}
        Goal: ${goals}
        Daily Availability: ${availability} hours
        
        The response must be a valid JSON object with the following structure:
        {
            "title": "Plan Title",
            "description": "Short description",
            "schedule": [
                {
                    "day": "Day 1",
                    "topics": [
                        { "name": "Topic Name", "duration": 60, "priority": "high" }
                    ]
                }
            ]
        }
        Ensure the plan is realistic, covers weak subjects first, and includes breaks. Return ONLY the JSON.
    `;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        // Clean the response to ensure it's valid JSON
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        return jsonMatch ? JSON.parse(jsonMatch[0]) : null;
    } catch (error) {
        console.error("AI Generation Error:", error);
        return null;
    }
};

export const generateQuiz = async (subject: string, topic: string, difficulty: string) => {
    const prompt = `
        Generate a ${difficulty} difficulty quiz for the subject "${subject}" and topic "${topic}".
        Include 5 MCQs.
        
        The response must be a valid JSON object with the following structure:
        {
            "questions": [
                {
                    "questionText": "...",
                    "options": ["A", "B", "C", "D"],
                    "correctAnswer": "...",
                    "explanation": "...",
                    "type": "mcq"
                }
            ]
        }
        Return ONLY the JSON.
    `;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        return jsonMatch ? JSON.parse(jsonMatch[0]) : null;
    } catch (error) {
        console.error("Quiz Generation Error:", error);
        return null;
    }
};

export const summarizeNotes = async (content: string) => {
    const prompt = `
        Summarize the following study notes and extract 3-5 key flashcards:
        Content: ${content}
        
        The response must be a valid JSON object:
        {
            "summary": "...",
            "flashcards": [
                { "front": "Question/Term", "back": "Answer/Definition" }
            ]
        }
        Return ONLY the JSON.
    `;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        return jsonMatch ? JSON.parse(jsonMatch[0]) : null;
    } catch (error) {
        console.error("Summarization Error:", error);
        return null;
    }
};
