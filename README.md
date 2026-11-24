# 🇮🇳 ResourceMap India
### Smart Resource & Volunteer Allocation for Humanitarian Disaster Relief

[![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v4.0-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Express](https://img.shields.io/badge/Express-4.21-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![NVIDIA Nemotron](https://img.shields.io/badge/NVIDIA-Nemotron_3_Ultra-76B900?logo=nvidia&logoColor=white)](https://openrouter.ai/models/nvidia/nemotron-3-ultra-550b-a55b:free)
[![Leaflet GIS](https://img.shields.io/badge/Leaflet-1.9.4-199900?logo=leaflet&logoColor=white)](https://leafletjs.com/)

**ResourceMap India** is an open-source, full-stack disaster response and volunteer allocation platform engineered to bridge the critical gap between community crises and skilled humanitarian responders. Powered by sub-meter **Leaflet GIS mapping**, an algorithmic **Haversine multi-factor matching engine**, and **NVIDIA Nemotron 3 Ultra AI**, the platform transforms unstructured field notes into localized, actionable relief tickets in seconds.

---

## 🌟 Key Features

### 1. 🗺️ Sub-Meter GIS Interactive Mapping (`/needs`)
- Real-time Leaflet mapping showing categorized community tickets across **Food, Health, Shelter, Education, and Environment**.
- Centered on India (`22.5937° N, 78.9629° E`) with dynamic zoom controls and priority-colored pulsating markers (*Critical, High, Medium, Low*).
- **One-Click Regional Sector Jumps**:
  - **Sundarbans Delta (WB)**: Tidal breach flood relief & potable water purification.
  - **Wayanad (KL)**: Monsoon landslide medical clinics, triage, and snakebite first aid.
  - **Assam Brahmaputra Basin**: Displaced school books, student kits, and flood relief.
  - **Puri Coastal Corridor (OD)**: Cyclone-resistant tarpaulins & emergency bamboo shelters.
  - **Bundelkhand (UP)**: Drought drinking water tanker logistics & solar filtration.
  - **Delhi NCR**: Yamuna floodplain community kitchen & sanitation.
  - **Mumbai**: Urban slum waterlogging triage & preventative medicine.

### 2. 🧮 Multi-Factor Haversine Matching Engine
Calculates match compatibility ($0 - 100\%$) between volunteer profiles and community needs using four weighted dimensions:
1. **Geographic Proximity ($0 - 30\text{ pts}$)**: Calculated via great-circle Haversine formula against disaster coordinates.
2. **Skill Vector Overlap ($0 - 40\text{ pts}$)**: Semantic alignment between volunteer certifications and ticket urgency requirements.
3. **Weekly Availability ($0 - 20\text{ pts}$)**: Dedicated weekly hours vs. acute response needs.
4. **Historical Impact ($0 - 10\text{ pts}$)**: Verified ratings and completion scores.

### 3. ⚡ NVIDIA Nemotron 3 Ultra AI Ingestion (`/dashboard/ngo`)
- Integrates the **NVIDIA Nemotron 3 Ultra (`nvidia/nemotron-3-ultra-550b-a55b:free`)** model via OpenRouter.
- Ingests unstructured field notes, damage assessments, or uploaded files (`.txt`, `.md`, `.csv`) and outputs standardized JSON crisis tickets.
- Generates **AI Tactical Dispatch Recommendations** for volunteer candidates with operational reasoning.
- Multi-tier resilience: Express backend API -> Direct OpenRouter client fallback -> Intelligent Indian regional heuristic parser.

### 4. 💬 Interactive AI Agent Chatbot
- Floating assistant anchored across the entire website styled after modern AI agent chat interfaces.
- Answers questions about finding aid, navigating the map, volunteering, and NGO survey ingestion.
- Pre-programmed with national disaster helpline integration (**112**, **1078 NDMA**).

### 5. 👥 Role-Based Portals & Dashboards
- **Volunteer Portal (`/dashboard/volunteer`)**: View top nearby algorithmic matches, filter open missions, track verified impact scores, and log hours.
- **NGO Operations Core (`/dashboard/ngo`)**: Upload field surveys, run the Nemotron AI Scanner, post new tickets, and review candidate fits.
- **Admin Command Telemetry (`/dashboard/admin`)**: Oversee national platform metrics, verify NGO credentials (Darpan ID, FCRA), and monitor dispatch latency.

---

## 🏗️ Project Architecture & Directory Structure

The project maintains a **clean separation between Frontend and Backend**:

```
Smart-Resource-Allocation/
├── .env                       # Environment configuration & Nemotron API keys
├── index.html                 # Single page application entrypoint & Leaflet CDN
├── package.json               # Scripts and unified full-stack dependencies
├── tsconfig.json              # TypeScript compilation rules
├── vite.config.ts             # Vite bundler configuration & environment defines
├── server.ts                  # Root entrypoint delegating to server/index.ts
│
├── server/                    # 🚀 BACKEND ARCHITECTURE (Node.js + Express)
│   ├── index.ts               # Express server setup, CORS, and router mounting
│   ├── routes/
│   │   ├── auth.ts            # Registration, Login, Google OAuth, Session
│   │   ├── needs.ts           # CRUD community crisis tickets
│   │   ├── volunteers.ts      # Volunteer directory & profile lookups
│   │   ├── matches.ts         # Haversine distance multi-factor matching engine
│   │   └── ai.ts              # NVIDIA Nemotron survey parser, match briefs, chatbot
│   ├── data/
│   │   └── seedData.ts        # In-memory database with Indian crisis tickets & volunteers
│   └── utils/
│       ├── geo.ts             # Haversine distance calculations
│       └── nemotron.ts        # OpenRouter NVIDIA Nemotron caller & fallback parsers
│
└── src/                       # 🎨 FRONTEND ARCHITECTURE (React 19 + TypeScript + Vite)
    ├── App.tsx                # Main router layout & global floating AI Chatbot
    ├── index.css              # Professional Light SaaS theme & Tailwind definitions
    ├── main.tsx               # React DOM mounting
    ├── types.ts               # Core domain TypeScript interfaces
    ├── components/
    │   ├── layout/
    │   │   ├── Navbar.tsx     # Navigation bar with 🇮🇳 India Network status badge
    │   │   └── AiChatbot.tsx  # Floating NVIDIA Nemotron conversational agent widget
    │   └── ui/                # Accessible design system components (buttons, dialogs, etc.)
    ├── hooks/
    │   └── useAuth.tsx        # Authentication provider (Email/Password + Google OAuth)
    ├── lib/
    │   ├── firebase.ts        # Firebase Authentication & Firestore configuration
    │   ├── seed.ts            # Frontend mock organizations & seed data
    │   └── utils.ts           # Tailwind merge & className utilities
    ├── pages/
    │   ├── LandingPage.tsx    # Animated landing page with live incident simulator
    │   ├── NeedsMapPage.tsx   # Sub-meter Leaflet GIS map with regional sector pills
    │   ├── AboutPage.tsx      # Platform overview & technical documentation
    │   ├── ContactPage.tsx    # National disaster emergency contacts (112, 1078, 108)
    │   ├── PrivacyPage.tsx    # Data protection & ephemeral AI processing policy
    │   ├── auth/              # SignIn, SignUp, and ForgotPassword pages
    │   └── dashboard/
    │       ├── VolunteerDashboard.tsx  # Volunteer missions & impact score tracking
    │       ├── NGODashboard.tsx        # NGO survey ingestion & Nemotron AI scanner
    │       └── AdminDashboard.tsx      # Platform telemetry & NGO verification
    └── services/
        └── aiService.ts       # Frontend client service for survey parsing & chatbot
```

---

## 🛠️ Tech Stack

| Domain | Technology | Description |
|---|---|---|
| **Frontend Framework** | **React 19** | Latest concurrent React engine |
| **Language** | **TypeScript 5.8** | Strictly typed domain models and API contracts |
| **Styling & Theme** | **Tailwind CSS v4** | Clean, accessible Professional Light theme |
| **Animations** | **Framer Motion / Motion** | Smooth transitions and simulated live telemetry |
| **Mapping & GIS** | **Leaflet & React-Leaflet** | OpenStreetMap tiles, sub-meter pins, custom markers |
| **Backend Server** | **Node.js & Express 4** | RESTful modular API with CORS and static serving |
| **AI / LLM Model** | **NVIDIA Nemotron 3 Ultra** | `nvidia/nemotron-3-ultra-550b-a55b:free` via OpenRouter |
| **Data Visualization** | **Recharts** | Real-time demand and resolution analytics |
| **Authentication** | **Firebase / Custom Auth** | Google OAuth, Email/Password, role management |
| **Bundler & Tooling** | **Vite 6** | Ultra-fast HMR and optimized production bundles |

---

## 📡 API Reference

The backend API runs on port `3001` (or your configured `PORT`):

### 1. Authentication (`/api/auth`)
- `POST /api/auth/register` — Create a new volunteer or NGO manager account.
- `POST /api/auth/login` — Sign in with email and password.
- `POST /api/auth/google` — Sign in or synchronize with Google OAuth profile.
- `GET /api/auth/me` — Verify session and fetch current active user.

### 2. Community Needs (`/api/needs`)
- `GET /api/needs` — List all community crisis tickets (supports `?category=`, `?urgency=`, `?status=`).
- `GET /api/needs/:id` — Retrieve details for a specific need.
- `POST /api/needs` — Create a new community need ticket with geospatial coordinates.
- `PATCH /api/needs/:id/status` — Update ticket status (`OPEN`, `IN_PROGRESS`, `RESOLVED`).

### 3. Volunteers (`/api/volunteers`)
- `GET /api/volunteers` — Fetch verified volunteers directory with skill vectors and availability.
- `GET /api/volunteers/:id` — Fetch individual volunteer profile.

### 4. Smart Matching (`/api/matches`)
- `GET /api/matches/need/:needId` — Runs the multi-factor Haversine distance engine and returns top-ranked volunteer candidates with compatibility scores.

### 5. NVIDIA Nemotron AI Engine (`/api/ai`)
- `GET /api/ai/status` — Health and telemetry for the active NVIDIA Nemotron model.
- `POST /api/ai/parse-survey` — Accepts raw disaster survey text (`{ content }`) and outputs categorized, prioritized JSON community needs.
- `POST /api/ai/recommend-match` — Generates a concise tactical recommendation for dispatching a volunteer to a community need.
- `POST /api/ai/chat` — Conversational assistance endpoint for the site chatbot.

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18.0.0 or higher recommended)
- **npm** (v9.0.0 or higher)

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/Smart-Resource-Allocation.git
cd Smart-Resource-Allocation
```

### 2. Configure Environment Variables
Create or verify your `.env` file in the project root:
```env
# NVIDIA Nemotron OpenRouter API Key
NVIDIA_NEMOTRON="your_openrouter_api_key_here"
OPENROUTER_API_KEY="your_openrouter_api_key_here"
NEMOTRON_MODEL="nvidia/nemotron-3-ultra-550b-a55b:free"

# Server configuration
PORT=3001
NODE_ENV=development
APP_URL="http://localhost:5173"
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Start the Application

You can run both the frontend and backend simultaneously or independently:

#### Option A: Run Full-Stack Concurrently (Recommended)
```bash
npm run dev
```

#### Option B: Run Services Separately
```bash
# Terminal 1 - Start the Backend API (Port 3001)
npm run backend

# Terminal 2 - Start the Frontend Vite Server (Port 5173)
npm run frontend
```

### 5. Access the Web App
- **Frontend Web Application**: [http://localhost:5173](http://localhost:5173)
- **Backend API & Health**: [http://localhost:3001/api/health](http://localhost:3001/api/health)
- **Interactive Leaflet Map**: [http://localhost:5173/needs](http://localhost:5173/needs)
- **NGO Operations Core (AI Ingestion)**: [http://localhost:5173/dashboard/ngo](http://localhost:5173/dashboard/ngo)
- **Volunteer Hub**: [http://localhost:5173/dashboard/volunteer](http://localhost:5173/dashboard/volunteer)

---

## 🇮🇳 Indian Disaster Management Alignment

ResourceMap India operates in harmony with India's humanitarian disaster framework:
- **National Emergency Helpline**: `112` (Pan-India 24x7)
- **National Disaster Management Authority (NDMA)**: `1078`
- **Medical Emergency / Ambulance**: `108` / `102`
- **State Emergency Operation Centers (SEOC)**: Regional disaster corridors mapped across Assam, Odisha, West Bengal, Kerala, Uttarakhand, Maharashtra, and Uttar Pradesh.

---

## 🧪 Testing & Verification

Run the TypeScript type verification:
```bash
npx tsc --noEmit
```

Build the production distribution:
```bash
npm run build
```

---

## 📄 License
This project is open-source and distributed under the [Apache-2.0 License](LICENSE).
Built with ❤️ for social impact and disaster relief across India.
