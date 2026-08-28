# High-Level Design (HLD)
## Project: AI Study Mentor
**Version:** 1.0.0  
**Status:** Approved  
**Author:** AI Product & Engineering Team  
**Last Updated:** 2026-08-28  

---

## 1. System Architectural Overview

The **AI Study Mentor** is architected as a modular, cloud-native micro-monolith (scalable into microservices as load grows), emphasizing high responsiveness, real-time streaming, and resilient AI orchestration.

```mermaid
graph TB
    subgraph ClientLayer[Client Tier]
        WebClient[Next.js 15 Web Application]
        PWA[Progressive Web App / Mobile Shell]
    end

    subgraph EdgeLayer[Edge & Gateway Tier]
        CDN[Cloudflare CDN & DDoS Protection]
        APIGateway[API Gateway / Reverse Proxy - Traefik/Nginx]
    end

    subgraph ServiceLayer[Core Application Services]
        AuthService[Auth & User Service]
        PlanService[Study Plan & Calendar Service]
        QuizService[Diagnostic & Quiz Service]
        CardService[Flashcard & Spaced Repetition Service]
        ChatService[Socratic AI Tutor Service]
        AnalyticsService[Analytics & Readiness Service]
    end

    subgraph AIWorkerLayer[AI & Async Processing Tier]
        RAGOrchestrator[RAG & Semantic Retrieval Engine]
        EmbeddingWorker[Document Parsing & Embedding Worker]
        TaskQueue[BullMQ / Redis Task Queue]
    end

    subgraph DataLayer[Data & Persistence Tier]
        PostgreSQL[(PostgreSQL 16 Relational DB)]
        PGVector[(pgvector Extension - HNSW Index)]
        RedisCache[(Redis Cluster - Sessions, Cache, Rate Limits)]
        BlobStorage[(Cloudflare R2 / AWS S3 - Uploaded PDFs)]
    end

    subgraph ExternalAPIs[External Services]
        LLMProvider[Anthropic Claude / OpenAI GPT-4o API]
        EmbeddingsAPI[OpenAI / Gemini Embeddings API]
    end

    %% Routing
    ClientLayer --> CDN
    CDN --> APIGateway
    APIGateway --> ServiceLayer
    APIGateway --> ChatService

    %% Service to Storage
    ServiceLayer --> PostgreSQL
    ServiceLayer --> RedisCache
    ServiceLayer --> TaskQueue

    %% AI and Async Flows
    TaskQueue --> EmbeddingWorker
    EmbeddingWorker --> BlobStorage
    EmbeddingWorker --> EmbeddingsAPI
    EmbeddingWorker --> PGVector

    ChatService --> RAGOrchestrator
    RAGOrchestrator --> PGVector
    RAGOrchestrator --> LLMProvider
    RAGOrchestrator --> RedisCache
```

---

## 2. Component Decomposition & Responsibilities

### 2.1. Client Tier (Frontend Web & PWA)
- **Framework**: Next.js 15 with App Router and React Server Components (RSC).
- **Core Modules**:
  - `StudyPlannerView`: Interactive calendar displaying scheduled study milestones, drag-and-drop rescheduling, and target milestone checklists.
  - `SocraticChatView`: Streaming markdown chat interface with mathematical formula rendering ($\LaTeX$ / KaTeX), code syntax highlighting, and voice I/O.
  - `FlashcardDeckView`: 3D card-flip animations, keyboard shortcuts (`Space` to flip, `1-4` for ratings), and progress rings.
  - `DiagnosticQuizModal`: Step-by-step interactive assessment with immediate conceptual breakdown.
  - `FocusMode`: Fullscreen distraction-free timer with ambient lo-fi player.

### 2.2. API Gateway & Routing Tier
- **Rate Limiter**: Token-bucket algorithm per IP and authenticated User ID.
- **Auth Interceptor**: Validates JWTs, injects `UserContext`, verifies subscription tier or resource ownership.
- **SSE Stream Handler**: Manages long-lived Server-Sent Event connections for real-time LLM token streams.

### 2.3. Core Domain Services
1. **User & Auth Service**: Handles registration, OAuth2 identity federation, session validation, and user learning preferences.
2. **Study Plan & Calendar Service**: Calculates syllabus segment distribution across student deadlines using workload balancing heuristics.
3. **Flashcard & SRS Service**: Implements SM-2 spaced repetition state transitions, card generation pipelines, and deck categorization.
4. **Diagnostic & Quiz Service**: Orchestrates dynamic question generation from syllabus topics, evaluates answers, and produces concept mastery matrices.
5. **Analytics & Readiness Service**: Aggregates study session durations, calculates streak continuity, and runs readiness forecast calculations.

### 2.4. AI & RAG Orchestration Service
- **Semantic Chunk Retriever**: Queries `pgvector` using cosine distance with MMR (Maximal Marginal Relevance) to balance relevance and diversity.
- **Context Reranker**: Optionally reranks top-15 retrieved chunks to feed top-5 highest-yield excerpts to the LLM.
- **Socratic Prompt Pipeline**: Injects conversation history, syllabus context, and Socratic pedagogical rules.

---

## 3. Communication Protocols & Data Contracts

| Interaction | Protocol | Format | Use Case |
| :--- | :--- | :--- | :--- |
| **Client $\leftrightarrow$ Server CRUD** | HTTPS / REST | JSON | User profiles, deck management, plan creation, quiz submission. |
| **Socratic AI Streaming** | HTTPS / Server-Sent Events (SSE) | `text/event-stream` | Streaming token-by-token tutor responses to client. |
| **Document Ingestion Jobs** | Async Task Queue | BullMQ over Redis | Non-blocking extraction and embedding of large textbooks. |
| **Vector Similarity Queries** | PostgreSQL Protocol | SQL with `<=>` Operator | In-database vector cosine similarity ranking. |

---

## 4. Resilience, Fault Tolerance & Graceful Degradation

```mermaid
graph TD
    UserQuery[Student asks question] --> PrimaryLLM{Primary LLM: Claude 3.5 / GPT-4o}
    PrimaryLLM -->|Success 200 OK| StreamClient[Stream Response to Student]
    PrimaryLLM -->|Rate Limit 429 / Timeout > 5s| CircuitBreaker{Circuit Breaker Open?}
    CircuitBreaker -->|Yes| FallbackLLM[Fallback Model: Gemini 1.5 Flash / GPT-4o-mini]
    FallbackLLM -->|Success| StreamClient
    FallbackLLM -->|Fail| CachedKnowledge[Serve Cached Static Topic Summary & Prompt Retry]
```

- **Circuit Breakers**: Wraps external LLM provider calls with a 3-strike threshold. If timeouts exceed 5 seconds, traffic automatically fails over to a secondary model provider.
- **Database Connection Pooling**: PgBouncer / Prisma connection pooling with max pool limits to prevent connection exhaustion under spiky loads.
- **Optimistic UI Updates**: Flashcard reviews and milestone check-offs update the local client state immediately, queuing offline sync if network connectivity drops.

---

## 5. Security & Infrastructure Topology

```mermaid
graph LR
    subgraph CloudVPC[Virtual Private Cloud - VPC]
        subgraph PublicSubnet[Public Subnet]
            ALB[Application Load Balancer]
        end
        subgraph PrivateSubnet[Private Subnet - App & Workers]
            AppCluster[Node.js / FastAPI App Instances]
            WorkerCluster[BullMQ Background Workers]
        end
        subgraph SecureDataSubnet[Isolated Data Subnet]
            RDS[(PostgreSQL 16 + pgvector)]
            RedisInst[(Managed Redis Cluster)]
        end
    end

    Internet((Internet)) -->|HTTPS / Port 443| ALB
    ALB --> AppCluster
    AppCluster --> RDS
    AppCluster --> RedisInst
    WorkerCluster --> RDS
    WorkerCluster --> RedisInst
```

- **Zero-Trust Network**: Databases and Redis caches are strictly isolated in private subnets with no public IP exposure.
- **Secrets Management**: Environment variables and API keys (OpenAI/Anthropic keys) are injected at runtime via encrypted secrets managers.
- **PII Scrubbing**: Student personal information is stripped from RAG chunks before embedding.
