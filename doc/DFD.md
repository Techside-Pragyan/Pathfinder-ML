# Data Flow Diagrams (DFD)
## Project: AI Study Mentor
**Version:** 1.0.0  
**Status:** Approved  
**Author:** AI Product & Engineering Team  
**Last Updated:** 2026-08-28  

---

## 1. DFD Level 0: Context Diagram

The Level 0 Context Diagram establishes the boundary of the **AI Study Mentor** platform, depicting external entities and primary information exchanges.

```mermaid
graph TD
    Student[👤 Student / Learner]
    LLMProvider[🤖 LLM & Embeddings Provider<br/>OpenAI / Anthropic / Gemini]
    ExtStorage[☁️ Cloud Object Storage<br/>S3 / Cloudflare R2]
    ExtCalendar[📅 Google Calendar / iCal]

    System((⚙️ AI Study Mentor System))

    %% Student interactions
    Student -->|Uploads Notes/Syllabus, Sets Goals| System
    Student -->|Submits Quiz Answers & Flashcard Ratings| System
    Student -->|Sends Tutoring Queries & Voice Input| System
    System -->|Delivers Adaptive Study Plan & Tasks| Student
    System -->|Serves Spaced Repetition Flashcards & Quizzes| Student
    System -->|Streams Socratic Coaching & Mastery Feedback| Student

    %% LLM Provider interactions
    System -->|Raw Text Chunks for Embedding| LLMProvider
    LLMProvider -->|1536-dim Vector Embeddings| System
    System -->|RAG Prompts & Student Question Context| LLMProvider
    LLMProvider -->|Streaming Socratic Responses & Quiz Questions| System

    %% External Storage
    System -->|Raw Documents / Media| ExtStorage
    ExtStorage -->|File Previews & Download Streams| System

    %% External Calendar
    System -->|Exported Study Milestones & ICS Schedule| ExtCalendar
```

---

## 2. DFD Level 1: Major System Processes

The Level 1 Diagram decomposes the system into 7 major operational subsystems and maps their interactions with data stores.

```mermaid
graph LR
    %% External Entities
    Student[👤 Student]
    LLM[🤖 LLM Provider]

    %% Processes
    P1[1.0 User Auth & Profile Mgt]
    P2[2.0 Document Ingestion & Parsing]
    P3[3.0 Diagnostic & Gap Engine]
    P4[4.0 Adaptive Study Planner]
    P5[5.0 Active Recall & Spaced Repetition]
    P6[6.0 Socratic AI Tutoring & RAG]
    P7[7.0 Analytics & Mastery Engine]

    %% Data Stores
    D1[(D1: Users & Profiles)]
    D2[(D2: Documents & Vector Chunks)]
    D3[(D3: Study Plans & Milestones)]
    D4[(D4: Flashcards & SRS Intervals)]
    D5[(D5: Chat Memory & Interactions)]
    D6[(D6: Analytics & Quiz Logs)]

    %% Connections
    Student -->|Credentials & Preferences| P1
    P1 <-->|Read/Write User Record| D1

    Student -->|Uploads PDF / Notes| P2
    P2 -->|Text Extraction & Embeddings| LLM
    LLM -->|Vector Chunks| P2
    P2 -->|Store Chunks & Embeddings| D2

    D2 -->|Retrieve Topics| P3
    P3 -->|Generate Diagnostic Quiz| LLM
    P3 -->|Serve Baseline Test| Student
    Student -->|Diagnostic Quiz Answers| P3
    P3 -->|Store Diagnostic Baseline| D6

    D6 -->|Diagnostic Scores| P4
    D2 -->|Syllabus Outline| P4
    Student -->|Exam Date & Target Hours| P4
    P4 -->|Create/Update Daily Milestones| D3
    D3 -->|Daily Schedule View| Student

    D2 -->|Source Material| P5
    P5 -->|Generate Flashcards| LLM
    P5 -->|Persist Cards| D4
    D4 -->|Due Flashcards| P5
    P5 -->|Flashcard Prompt| Student
    Student -->|Recall Rating 0-5| P5
    P5 -->|Update SM-2 Intervals & Next Review Date| D4
    P5 -->|Log Practice Session| D6

    Student -->|Tutoring Question| P6
    P6 -->|Semantic Similarity Query| D2
    D2 -->|Relevant Context Excerpts| P6
    D5 -->|Recent Chat History| P6
    P6 -->|Socratic Prompt + Context| LLM
    LLM -->|Streaming Guided Response| P6
    P6 -->|Stream Response| Student
    P6 -->|Save Message History| D5

    D6 -->|Aggregated Study Logs| P7
    D3 -->|Completion Rates| P7
    P7 -->|Mastery Heatmap & Exam Readiness Index| Student
```

---

## 3. DFD Level 2: Detailed Subsystem Flows

### 3.1. Process 2.0: Document Ingestion & Chunking Flow (Level 2)

```mermaid
graph TD
    File[Uploaded File: PDF/DOCX] --> P2_1[2.1 File Validation & Virus Scan]
    P2_1 -->|Valid File| P2_2[2.2 Text & OCR Extraction]
    P2_2 -->|Raw Text Stream| P2_3[2.3 Semantic Markdown Chunking]
    P2_3 -->|512-Token Chunks| P2_4[2.4 Embedding Generation]
    P2_4 -->|API Request| LLM_Embed[Embedding Model]
    LLM_Embed -->|Vector Array| P2_4
    P2_4 --> P2_5[2.5 Vector & Relational Storage]
    P2_5 -->|Persist Metadata| D2_Doc[(D2: Document Metadata)]
    P2_5 -->|Persist Vectors| D2_Vec[(D2: pgvector Chunks)]
```

### 3.2. Process 5.0: Spaced Repetition (SRS) Engine Flow (Level 2)

```mermaid
graph TD
    Req[Student opens Flashcard Deck] --> P5_1[5.1 Query Due Cards where next_review_at <= NOW]
    P5_1 --> D4_Store[(D4: Flashcards & SRS State)]
    D4_Store -->|Due Card Queue| P5_2[5.2 Present Front of Card]
    P5_2 --> Student[Student Views Card & Flips to Reveal Back]
    Student -->|Submits Rating: 0=Blackout, 3=Pass, 5=Perfect| P5_3[5.3 SM-2 Calculation Unit]
    P5_3 -->|Compute New Ease Factor EF| P5_4[5.4 Update Interval & Repetition Count]
    P5_4 -->|Calculate next_review_at = NOW + Interval| P5_5[5.5 Persist Updated SRS State]
    P5_5 --> D4_Store
    P5_5 -->|Log Performance Metric| D6_Log[(D6: Study Analytics Logs)]
```

### 3.3. Process 6.0: Socratic RAG Tutoring Flow (Level 2)

```mermaid
graph TD
    Query[Student Asks: 'Why does gradient descent oscillate in narrow ravines?'] --> P6_1[6.1 Query Embedding & Intent Classification]
    P6_1 --> P6_2[6.2 Hybrid Vector + BM25 Search]
    P6_2 --> D2_Vec[(D2: pgvector Chunks)]
    D2_Vec -->|Top K Excerpts (K=5)| P6_3[6.3 Context Reranking & Assembly]
    P6_3 --> P6_4[6.4 Socratic System Prompt Injection]
    P6_4 --> D5_Mem[(D5: Chat Memory / Session Context)]
    D5_Mem -->|Last 10 turns| P6_4
    P6_4 --> P6_5[6.5 Stream Completion from LLM]
    P6_5 --> Client[Server-Sent Event Stream to Client]
    P6_5 -->|Save Turn to History| D5_Mem
```

---

## 4. Data Store Inventory & Data Dictionary

| Store ID | Name | Contents | Data Retention |
| :--- | :--- | :--- | :--- |
| **D1** | `users` | User credentials, profiles, timezone, study goal settings. | Permanent (until account deletion). |
| **D2** | `documents` & `document_chunks` | Raw extracted texts, metadata, 1536-dim vector embeddings. | Retained per course lifecycle. |
| **D3** | `study_plans` & `milestones` | Calendared study schedules, time allotments, completion status. | Retained across student academic semesters. |
| **D4** | `flashcard_decks` & `flashcards` | Front/Back text, SM-2 Ease Factor, repetition count, next review date. | Permanent per user account. |
| **D5** | `chat_sessions` & `messages` | Transcripts of student-AI tutor dialogue, token usage, feedback ratings. | 180 days active memory. |
| **D6** | `study_logs` & `quiz_attempts` | Timestamped practice logs, response times, diagnostic scores, streaks. | Aggregated permanently for analytics. |
