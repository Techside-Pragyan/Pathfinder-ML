# Agile User Stories & Acceptance Criteria
## Project: AI Study Mentor
**Version:** 1.0.0  
**Status:** Approved  
**Author:** AI Product & Engineering Team  
**Last Updated:** 2026-08-28  

---

## 1. Epic Overview & Prioritization Matrix

| Epic ID | Epic Title | Description | Total Points | Priority |
| :--- | :--- | :--- | :--- | :--- |
| **EPC-01** | Content Ingestion & Diagnostic Assessment | Parsing course notes, syllabus documents, and running baseline diagnostic quizzes. | 18 | Must Have |
| **EPC-02** | Adaptive Dynamic Study Planner | Generating personalized study schedules, milestone tracking, and dynamic auto-rescheduling. | 21 | Must Have |
| **EPC-03** | Active Recall & Spaced Repetition Engine | Automated flashcard generation, SM-2 interval scheduling, and practice review decks. | 21 | Must Have |
| **EPC-04** | Socratic AI Tutoring & RAG Coaching | Context-grounded, conversational AI tutor that guides learning without spoon-feeding answers. | 26 | Must Have |
| **EPC-05** | Focus Timer, Streaks & Mastery Analytics | Pomodoro study timer, knowledge gap heatmaps, exam readiness scoring, and streak retention. | 13 | Should Have |

---

## 2. Detailed User Stories by Epic

### Epic 1: Content Ingestion & Diagnostic Assessment

#### US-101: Syllabus / PDF Document Upload
- **Story**: *As a university student, I want to upload my lecture slides, syllabus PDF, or textbook chapters, so that my AI Study Mentor has the exact context of what I need to study.*
- **Priority**: Must Have | **Story Points**: 5
- **Acceptance Criteria (Gherkin)**:
  ```gherkin
  Scenario: Successful PDF document upload and parsing
    Given I am on the "Upload Materials" page
    When I upload a valid PDF file under 50MB (e.g. "ML_Lecture_4.pdf")
    Then I should see a progress indicator showing text extraction and chunking
    And once finished, the document should appear in my "Active Courses" list with status "Ready"

  Scenario: Attempting to upload an unsupported or oversize file
    Given I am on the "Upload Materials" page
    When I attempt to upload a 65MB video file (.mp4)
    Then the upload should be rejected immediately with an error message: "File exceeds 50MB limit or unsupported format"
  ```

#### US-102: Baseline Diagnostic Pre-Assessment
- **Story**: *As a learner starting a new topic, I want to take a quick 5-minute diagnostic quiz, so that the AI can detect my baseline knowledge and skip concepts I already understand.*
- **Priority**: Must Have | **Story Points**: 8
- **Acceptance Criteria (Gherkin)**:
  ```gherkin
  Scenario: Completing diagnostic quiz and generating knowledge gap profile
    Given I have ingested a new course module
    When I click "Start Diagnostic Assessment"
    Then the AI generates 5-8 multiple-choice and conceptual questions based on the material
    When I submit my answers
    Then I see a breakdown of "Mastered Topics" vs. "Gaps Needing Review"
    And my study schedule is customized to allocate more time to my weak areas
  ```

---

### Epic 2: Adaptive Dynamic Study Planner

#### US-201: Deadline-Driven Study Schedule Generation
- **Story**: *As a student preparing for a final exam, I want to specify my exam date and daily available study hours, so that I get a realistic daily task breakdown.*
- **Priority**: Must Have | **Story Points**: 8
- **Acceptance Criteria (Gherkin)**:
  ```gherkin
  Scenario: Generating a balanced study calendar
    Given I have an upcoming exam on "September 20"
    And I enter that I can study "45 minutes per day"
    When I click "Generate Adaptive Plan"
    Then the system creates daily milestones from today until the exam date
    And reserves the final 15% of days for full revision and practice exams
  ```

#### US-202: Zero-Guilt Dynamic Auto-Rescheduling
- **Story**: *As a busy student who had an emergency, I want the system to automatically adjust my remaining schedule when I miss a day, so that I don't feel overwhelmed by overdue backlog.*
- **Priority**: Must Have | **Story Points**: 8
- **Acceptance Criteria (Gherkin)**:
  ```gherkin
  Scenario: Auto-rebalancing missed study milestones
    Given I missed studying for 2 consecutive days due to travel
    When I log in on Day 3
    Then a prompt asks: "Would you like to auto-balance your remaining plan?"
    When I confirm "Yes, Adjust Plan"
    Then the system redistributes the missed topics across the remaining days without increasing daily workload past my max threshold
  ```

---

### Epic 3: Active Recall & Spaced Repetition Engine

#### US-301: Automated High-Yield Flashcard Generation
- **Story**: *As a learner, I want AI to automatically extract high-yield flashcards with definitions and formulas from my notes, so that I don't spend hours manually typing cards.*
- **Priority**: Must Have | **Story Points**: 8
- **Acceptance Criteria (Gherkin)**:
  ```gherkin
  Scenario: Generating flashcards from a chapter
    Given I have uploaded a chapter on "Regularization in Neural Networks"
    When I click "Generate Flashcard Deck"
    Then the AI creates 15-20 question-and-answer pairs covering key formulas and concepts
    And allows me to review, edit, or delete any generated card before saving to my deck
  ```

#### US-302: Spaced Repetition Review Flow (SM-2 Algorithm)
- **Story**: *As a student practicing flashcards, I want to rate my recall difficulty (Again, Hard, Good, Easy), so that the system schedules the card for review at the scientifically optimal interval.*
- **Priority**: Must Have | **Story Points**: 8
- **Acceptance Criteria (Gherkin)**:
  ```gherkin
  Scenario: Rating a flashcard as "Again" (Failed recall)
    Given I am reviewing a flashcard deck
    When I press Space to flip the card and select "Again [1]"
    Then the card is placed at the end of the current review session
    And its SM-2 repetition counter resets to 0 with an interval of 1 day

  Scenario: Rating a flashcard as "Easy" (Perfect recall)
    Given I am reviewing a card that had a 3-day interval
    When I select "Easy [4]"
    Then its interval increases according to the SM-2 Ease Factor (e.g. to 7+ days)
    And the card will not appear in due reviews until that timestamp
  ```

---

### Epic 4: Socratic AI Tutoring & RAG Coaching

#### US-401: Socratic Concept Clarification
- **Story**: *As a confused student, I want to ask my AI coach to explain a tricky concept from my notes, so that it guides me step-by-step with analogies rather than giving a wall of text.*
- **Priority**: Must Have | **Story Points**: 13
- **Acceptance Criteria (Gherkin)**:
  ```gherkin
  Scenario: Socratic explanation with grounded context
    Given I am chatting with the AI Coach in "Socratic Guided" mode
    When I ask: "Why does dropout prevent overfitting?"
    Then the AI responds with an intuitive analogy (e.g., team members learning not to rely on a single superstar)
    And cites the exact section from my uploaded lecture slides
    And concludes with a quick check-in question to test my understanding
  ```

#### US-402: Speech & Voice Study Mode
- **Story**: *As an auditory learner or student on a walk, I want to speak to my AI mentor via voice and hear spoken responses, so that I can practice active recall hands-free.*
- **Priority**: Could Have | **Story Points**: 8
- **Acceptance Criteria (Gherkin)**:
  ```gherkin
  Scenario: Voice Q&A session
    Given I click the "Voice Mode" microphone icon
    When I speak a study question aloud
    Then the speech is transcribed with high accuracy (< 1s latency)
    And the AI Mentor speaks the Socratic guidance back using natural text-to-speech audio
  ```

---

### Epic 5: Focus Timer, Streaks & Mastery Analytics

#### US-501: Integrated Pomodoro Focus Room
- **Story**: *As a student prone to distractions, I want an integrated Pomodoro timer with ambient focus sounds, so that I stay in a flow state during study sessions.*
- **Priority**: Should Have | **Story Points**: 5
- **Acceptance Criteria (Gherkin)**:
  ```gherkin
  Scenario: Running a 25-minute focus session
    Given I start a focus session on "Topic: Backpropagation"
    When the 25-minute countdown finishes
    Then an audio chime rings
    And 25 minutes of active focus time is automatically credited to my daily analytics and streak
  ```

#### US-502: Exam Readiness Score & Knowledge Heatmap
- **Story**: *As a student approaching exam week, I want a probabilistic Readiness Score (0-100%) and topic mastery heatmap, so that I know exactly when I am prepared to get an A.*
- **Priority**: Should Have | **Story Points**: 8
- **Acceptance Criteria (Gherkin)**:
  ```gherkin
  Scenario: Viewing exam readiness analytics
    Given I have completed 80% of milestones and maintained an 85% flashcard accuracy
    When I navigate to the "Analytics" tab
    Then I see a color-coded topic heatmap (Green = High Mastery, Amber = Review Needed, Red = Critical Gap)
    And an overall "Exam Readiness: 88% - On Track" indicator with actionable recommendations
  ```
