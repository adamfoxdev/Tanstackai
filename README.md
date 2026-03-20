# TanStack AI Chat

A full-featured AI chat application demonstrating TanStack Query, TanStack Router, and TanStack Table with React + TypeScript + Vite.

## Features

- 🤖 **AI Chat Interface** – Stream responses from OpenAI using TanStack Query mutations
- 🗺️ **Client-side Routing** – Navigation between Chat and History pages with TanStack Router
- 📊 **Conversation History** – Sortable table of past conversations powered by TanStack Table
- 💾 **Local Persistence** – Conversations stored in `localStorage`
- ⚡ **Streaming Responses** – Real-time token streaming from OpenAI
- 🎨 **Tailwind CSS** – Clean, responsive UI

## Tech Stack

| Library | Version | Purpose |
|---|---|---|
| React | 19 | UI Framework |
| TypeScript | 5 | Type Safety |
| Vite | 8 | Build Tool |
| TanStack Query | 5 | Server state & mutations |
| TanStack Router | 1.168 | Client-side routing |
| TanStack Table | 8 | Data table for history |
| OpenAI SDK | 6 | AI API client |
| Tailwind CSS | 3 | Styling |

## Setup

### 1. Clone and install dependencies

```bash
git clone <repo>
cd <repo>
npm install
```

### 2. Configure environment variables

```bash
cp .env.example .env
```

Edit `.env` and add your OpenAI API key:

```
VITE_OPENAI_API_KEY=sk-...your-key-here...
VITE_OPENAI_MODEL=gpt-4o-mini
```

### 3. Run the development server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## How It Works

### TanStack Query
Used for the `useMutation` hook in `src/hooks/useChat.ts`. When a user sends a message, `sendMessageMutation` fires an async function that calls the OpenAI streaming API and updates the UI progressively.

### TanStack Router
Configured in `src/router.tsx` with file-based routes in `src/routes/`. The `NavBar` uses the `<Link>` component for active-state-aware navigation.

### TanStack Table
Used in `src/routes/history.tsx` to render a sortable table of all stored conversations. Columns include title, message count, and timestamps.

## Project Structure

```
src/
├── main.tsx           # Entry point with QueryClient + RouterProvider
├── router.tsx         # TanStack Router instance
├── routes/
│   ├── __root.tsx     # Root layout with NavBar
│   ├── index.tsx      # Redirects to /chat
│   ├── chat.tsx       # Chat page
│   └── history.tsx    # History page with TanStack Table
├── components/
│   ├── ChatMessage.tsx
│   └── NavBar.tsx
├── hooks/
│   └── useChat.ts     # Core chat logic with TanStack Query
├── lib/
│   └── openai.ts      # OpenAI client
└── types/
    └── chat.ts        # TypeScript interfaces
```

## Security Note

This project uses `dangerouslyAllowBrowser: true` with the OpenAI SDK, which means your API key is included in client-side JavaScript. **This is intentional for local development and demo purposes only.**

For production deployments, proxy OpenAI requests through a backend server (e.g., Express, Fastify, or a serverless function) so your API key is never exposed to the browser.

## Build

```bash
npm run build
```

