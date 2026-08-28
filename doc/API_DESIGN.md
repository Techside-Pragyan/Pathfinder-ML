# REST & Streaming API Design Specification
## Project: AI Study Mentor
**Version:** 1.0.0  
**Status:** Approved  
**Author:** AI Product & Engineering Team  
**Last Updated:** 2026-08-28  

---

## 1. Global API Standards & Conventions

- **Base URL**: `https://api.studymentor.ai/api/v1`
- **Authentication**: `Authorization: Bearer <JWT_ACCESS_TOKEN>`
- **Content-Type**: `application/json` (except file uploads which use `multipart/form-data`)
- **Standard Error Format (RFC 7807)**:
  ```json
  {
    "type": "https://api.studymentor.ai/errors/INVALID_PAYLOAD",
    "title": "Invalid Request Parameters",
    "status": 400,
    "detail": "The 'targetExamDate' field must be in the future.",
    "instance": "/api/v1/plans/generate",
    "timestamp": "2026-08-28T20:00:00Z"
  }
  ```

---

## 2. API Endpoints by Subsystem

### 2.1. Authentication & User Profile

#### `POST /auth/register`
- **Description**: Register a new student account.
- **Request Body**:
  ```json
  {
    "email": "alex.student@university.edu",
    "password": "SecurePassword123!",
    "fullName": "Alex Rivera"
  }
  ```
- **Response `201 Created`**:
  ```json
  {
    "user": {
      "id": "c1f7a08b-71a2-4a7b-b384-5fca8306df9a",
      "email": "alex.student@university.edu",
      "fullName": "Alex Rivera"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "expiresIn": 900
  }
  ```

#### `POST /auth/login`
- **Description**: Authenticate using email and password.
- **Response `200 OK`**: Returns user profile, access token, and sets secure refresh cookie.

---

### 2.2. Course Materials & Document Ingestion

#### `POST /courses`
- **Description**: Create a new course subject module.
- **Request Body**:
  ```json
  {
    "title": "CS 301: Machine Learning",
    "description": "Foundations of supervised & unsupervised learning, deep nets.",
    "subjectCategory": "Computer Science"
  }
  ```
- **Response `201 Created`**:
  ```json
  {
    "id": "f8a7e3d1-92b0-46f9-b883-7c8fa10e3412",
    "title": "CS 301: Machine Learning",
    "createdAt": "2026-08-28T20:00:00Z"
  }
  ```

#### `POST /documents/upload`
- **Content-Type**: `multipart/form-data`
- **Form Fields**: `courseId` (UUID), `file` (Binary PDF/DOCX)
- **Response `202 Accepted`**:
  ```json
  {
    "documentId": "a93b4d81-22fe-4d7a-85bc-9e123456789a",
    "fileName": "ML_Lecture_4_Regularization.pdf",
    "status": "PROCESSING",
    "estimatedTimeSeconds": 8
  }
  ```

#### `GET /documents/:id/status`
- **Description**: Poll status of document parsing & vector embedding.
- **Response `200 OK`**:
  ```json
  {
    "documentId": "a93b4d81-22fe-4d7a-85bc-9e123456789a",
    "status": "COMPLETED",
    "chunksIndexed": 42,
    "totalTokens": 18450
  }
  ```

---

### 2.3. Adaptive Study Planner

#### `POST /plans/generate`
- **Description**: Generate an adaptive study schedule.
- **Request Body**:
  ```json
  {
    "courseId": "f8a7e3d1-92b0-46f9-b883-7c8fa10e3412",
    "targetExamDate": "2026-09-20",
    "dailyAvailableMinutes": 45
  }
  ```
- **Response `201 Created`**:
  ```json
  {
    "planId": "3b29c54e-09a8-4c12-87ff-44e21a0d8e22",
    "totalMilestones": 24,
    "targetExamDate": "2026-09-20",
    "milestones": [
      {
        "id": "e21b0a94-81cc-4f11-9a71-33c94a20b66a",
        "scheduledDate": "2026-08-29",
        "topicTitle": "Learn: Loss Functions & L2 Regularization",
        "estimatedMinutes": 45,
        "status": "PENDING"
      }
    ]
  }
  ```

#### `POST /plans/:id/reschedule`
- **Description**: Automatically redistribute missed or overdue milestones.
- **Request Body**:
  ```json
  {
    "reason": "MISSED_DAYS",
    "newDailyMinutes": 50
  }
  ```
- **Response `200 OK`**: Returns updated milestone array.

---

### 2.4. Spaced Repetition (SRS) Flashcards

#### `POST /decks/generate-from-document`
- **Description**: Auto-generate flashcards from an uploaded document.
- **Request Body**:
  ```json
  {
    "courseId": "f8a7e3d1-92b0-46f9-b883-7c8fa10e3412",
    "documentId": "a93b4d81-22fe-4d7a-85bc-9e123456789a",
    "cardCount": 15
  }
  ```
- **Response `201 Created`**: Returns generated flashcards.

#### `GET /decks/:id/due-cards`
- **Description**: Retrieve cards scheduled for review today (`next_review_at <= NOW()`).
- **Response `200 OK`**:
  ```json
  {
    "deckId": "7c12f45a-8b9a-412e-9d22-12f8e9102b44",
    "totalDue": 12,
    "cards": [
      {
        "id": "99f8e12a-33c1-419a-9e12-32a10e88cd55",
        "frontPrompt": "What is the primary difference between L1 (Lasso) and L2 (Ridge) Regularization?",
        "backAnswer": "L1 adds absolute penalty driving weights to exact zero (sparsity); L2 adds squared penalty decaying weights smoothly.",
        "repetitions": 2,
        "easeFactor": 2.5
      }
    ]
  }
  ```

#### `POST /flashcards/:id/review`
- **Description**: Submit recall rating (0 to 5) and update SM-2 interval.
- **Request Body**:
  ```json
  {
    "rating": 4,
    "durationMs": 4200
  }
  ```
- **Response `200 OK`**:
  ```json
  {
    "flashcardId": "99f8e12a-33c1-419a-9e12-32a10e88cd55",
    "newEaseFactor": 2.50,
    "newIntervalDays": 6,
    "nextReviewAt": "2026-09-03T20:00:00Z"
  }
  ```

---

### 2.5. Socratic AI Tutor & Streaming

#### `POST /chat/stream`
- **Description**: Stream real-time Socratic AI tutoring guidance via Server-Sent Events (SSE).
- **Headers**:
  - `Accept: text/event-stream`
  - `Cache-Control: no-cache`
- **Request Body**:
  ```json
  {
    "sessionId": "4a129f8c-2231-41de-84bb-990a8811e9f1",
    "courseId": "f8a7e3d1-92b0-46f9-b883-7c8fa10e3412",
    "message": "Why does Momentum SGD avoid getting trapped in saddle points?"
  }
  ```
- **Streaming Response (`text/event-stream`)**:
  ```
  event: context
  data: {"citedSources": [{"chunkId": "123", "page": 42, "title": "Momentum Optimization"}]}

  event: token
  data: {"delta": "Imagine "}

  event: token
  data: {"delta": "a heavy ball "}

  event: token
  data: {"delta": "rolling down a steep slope..."}

  event: done
  data: {"messageId": "msg_98124", "totalTokens": 142}
  ```

---

### 2.6. Analytics & Exam Readiness

#### `GET /analytics/dashboard-summary`
- **Description**: Fetch high-level mastery snapshot, streak status, and readiness forecast.
- **Response `200 OK`**:
  ```json
  {
    "currentStreakDays": 12,
    "totalFocusMinutes": 480,
    "examReadinessScore": 88,
    "readinessStatus": "ON_TRACK",
    "topicsMastery": [
      { "topic": "Linear & Logistic Regression", "masteryPercentage": 95 },
      { "topic": "Regularization & Loss Functions", "masteryPercentage": 82 },
      { "topic": "Neural Net Architectures", "masteryPercentage": 64 }
    ],
    "weakestConcept": {
      "title": "Vanishing Gradient Problem",
      "recommendedAction": "PRACTICE_FLASHCARDS"
    }
  }
  ```
