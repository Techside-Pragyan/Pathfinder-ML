# AI Study Mentor - Backend

The core API for the AI-Based Study Recommendation System. Powered by Node.js, Express, MongoDB, and Google Gemini AI.

## Features

- **AI Study Planner**: Generates personalized weekly schedules.
- **AI Quiz Engine**: Adaptive MCQs based on subject and difficulty.
- **AI Note Summarizer**: Extracts key concepts and flashcards.
- **Student Analytics**: Tracks progress, accuracy, and consistency.
- **User Management**: Integrated with Clerk for secure auth.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB (Mongoose)
- **AI Provider**: Google Gemini AI
- **Auth**: Clerk

## Getting Started

1.  Navigate to the `server` directory.
2.  Install dependencies: `npm install`.
3.  Create a `.env` file based on `.env.example`.
4.  Run in development: `npm run dev`.
5.  Build for production: `npm run build`.

## API Documentation

- `GET /health`: Health check.
- `GET /api/users/:clerkId`: Get user profile.
- `PUT /api/users/:clerkId`: Update profile.
- `POST /api/plans`: Generate AI study plan.
- `GET /api/plans/:userId`: Get study plans.
- `POST /api/quizzes/generate`: Generate AI quiz.
- `POST /api/ai/summarize`: Summarize study notes.
