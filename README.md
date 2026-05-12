# 🎯 Silvy DeepSeek Chat

Aplikasi web chat modern yang dibangun dengan **Next.js 15+** dan **TypeScript**, dengan integrasi lengkap untuk model AI **DeepSeek-R1**. Menampilkan streaming SSE real-time, reasoning display, dan support multi-model selection.

![TypeScript](https://img.shields.io/badge/TypeScript-95.3%25-3178C6?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)
![Next.js](https://img.shields.io/badge/Next.js-15.3.2-000000?style=flat-square)

---

## ✨ Fitur Utama

- 🚀 **Real-time SSE Streaming** - Respon AI ditampilkan secara real-time tanpa delay
- 🧠 **Reasoning Display** - Tampilkan proses reasoning dari DeepSeek-R1
- 🎛️ **Multi-model Support** - Pilih dari berbagai model AI yang tersedia
- 🔒 **Server-side Proxy** - API keys aman di backend, tidak expose ke client
- ⚡ **Smart Auto-scroll** - Auto-scroll dengan manual detection
- ⏸️ **Cancel Streaming** - User bisa menghentikan response yang sedang berjalan
- 🎨 **Lightweight Design** - Inline styles, no external CDN, sistem font stack
- 🛡️ **XSS Prevention** - Rendering aman dengan `textContent`

---

## 🏗️ Tech Stack

| Komponen | Teknologi |
|----------|-----------|
| **Framework** | Next.js 15+ (App Router) |
| **Language** | TypeScript (strict mode) |
| **Frontend** | React 19.1.0 |
| **Styling** | Inline styles + CSS |
| **API** | Server-side proxy dengan SSE |
| **Icons/Fonts** | Unicode characters + system font stack |

---

## 📁 Struktur Project

```
app/
├── api/chat/          # Server-side API proxy ke external AI
├── globals.css        # Dark theme global styles
├── layout.tsx         # Root layout
└── page.tsx          # Main chat page (client component)

components/chat/
├── ChatBubble.tsx     # Message bubble (user/AI/reasoning/error)
├── ChatHeader.tsx     # Header dengan title & model selector
├── ChatInput.tsx      # Textarea dengan send/stop button
├── ChatMessages.tsx   # Message list + auto-scroll logic
└── ModelSelector.tsx  # Model dropdown

hooks/
└── useAutoScroll.ts   # Custom hook auto-scroll behavior

lib/
├── constants.ts       # Colors, fonts, layout constants
├── environment.ts     # Environment variable accessors
├── prompts.ts         # System prompt definitions
├── streaming.ts       # SSE streaming logic
└── utils.ts          # ID generation & helpers

types/
└── message.ts        # TypeScript type definitions
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm atau yarn

### Installation

```bash
# Clone repository
git clone https://github.com/superfluz/Silvy-DeepSeek-Chat.git
cd Silvy-DeepSeek-Chat

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env.local
# Edit .env.local dengan konfigurasi Anda
```

### Environment Variables

```env
# Client-side (visible di browser - safe)
NEXT_PUBLIC_DEFAULT_MODEL=deepseek-r1
NEXT_PUBLIC_AVAILABLE_MODELS=deepseek-r1,deepseek-r1:14b,deepseek-r1:32b,llama3.2,qwen2.5

# Server-side (hidden - security)
API_ENDPOINT=http://localhost:11434/v1/responses
API_KEY=your-api-key-here
SYSTEM_PROMPT_KEY=default
```

### Running the Application

```bash
# Development mode
npm run dev
# Buka http://localhost:3000

# Production build
npm run build
npm start

# Linting
npm run lint
```

---

## 🔄 How It Works

### Chat Flow Diagram

```
User Input
    ↓
POST /api/chat { messages, model }
    ↓
Server validates & reads env vars
    ↓
Forward ke external AI endpoint
    ↓
SSE Stream Response
    ├─ reasoning_summary_text.delta
    ├─ output_text.delta
    └─ completed event
    ↓
Frontend parses & renders real-time
    ↓
Auto-scroll to latest message
    ↓
User dapat cancel dengan AbortController
```

### Security Architecture

- ✅ **API Keys Server-side Only** - Tidak ada exposure ke browser
- ✅ **CORS Prevention** - Server proxy menangani cross-origin
- ✅ **XSS Prevention** - Semua content rendered via `textContent`
- ✅ **No dangerouslySetInnerHTML** - Parsing aman tanpa injection risk

---

## 📝 Type Definitions

```typescript
interface Message {
  id: string;              // Unique identifier
  role: "user" | "ai";     // Message author
  content: string;         // Main content
  reasoning?: string;      // Optional reasoning (DeepSeek-R1)
  error?: string;         // Optional error
  isStreaming: boolean;   // Streaming status
}

interface ChatContextType {
  messages: Message[];
  loading: boolean;
  abortController?: AbortController;
}
```

---

## 🎨 Design Philosophy

### Lightweight & Fast
- Zero external CDN dependencies
- Minimal bundle size
- System font stack untuk fast loading

### Developer-friendly
- Full TypeScript support
- Clean, modular architecture
- Comprehensive environment configuration
- Strict ESLint rules

### Security-first
- Server-side proxy pattern
- Environment variable isolation
- No sensitive data di frontend

---

## 📊 Project Stats

| Metrik | Value |
|--------|-------|
| Primary Language | TypeScript (95.3%) |
| Framework | Next.js 15.3.2 |
| React Version | 19.1.0 |
| License | MIT |
| Repository Size | 58 KB |
| Open Issues | 6 |

---

## 🔐 Security Notes

- API credentials disimpan di `.env.local` (server-side)
- Frontend berkomunikasi hanya dengan `/api/chat`
- External API endpoint tidak pernah accessible dari browser
- Message content di-sanitize dengan `textContent` untuk prevent XSS

---

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details

---

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs via GitHub Issues
- Submit pull requests dengan improvements
- Share suggestions untuk new features

---

## 👨‍💻 About

Dibuat oleh [@superfluz](https://github.com/superfluz)

**Last Updated**: May 12, 2026

---

**Enjoy chatting with DeepSeek-R1! 🚀**
