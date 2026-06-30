# Dream Voyager ✈️🌍

**Dream Voyager** is a full-stack travel agency platform providing comprehensive booking, luxury travel package discovery, and customer inquiry features. Built with modern web technologies, it features an elegant user interface for clients and a powerful admin dashboard for agency management.

![Dream Voyager Preview](./client/public/favicon.svg)

## 🔗 Live Deployment
The client application is deployed on Vercel and accessible here:  
**[dream-voyager.vercel.app](https://dream-voyager.vercel.app)**

## 🛠️ Tech Stack
- **Frontend**: React, TypeScript, Vite, Tailwind CSS
- **Backend**: Node.js, Express, TypeScript
- **Database / Auth**: Supabase (PostgreSQL, Row Level Security)
- **AI Integration**: OpenAI API (for the virtual travel assistant)

## ✨ Key Features
- **Booking System**: Users can browse and book luxury travel packages.
- **Inquiry Handling**: Built-in forms and email triggers (via Resend) for customer inquiries.
- **Admin Dashboard**: Full CRM-style admin setup to manage bookings, packages, and users securely.
- **AI Virtual Assistant**: A smart travel assistant (via `/api/chat`). *(Note: Fully functional when an OpenAI API key is provided; otherwise, it degrades gracefully into a demo/mock mode.)*

## 🚀 Setup & Installation

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- A Supabase Project (for database and authentication)
- (Optional) OpenAI API Key for the AI Chat feature

### 1. Clone the repository
```bash
git clone https://github.com/your-username/dream-voyager.git
cd dream-voyager
```

### 2. Backend Setup (Server)
```bash
cd server
npm install
```
Create a `.env` file in the `server` directory with the following variables:
```env
PORT=5000
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
RESEND_API_KEY=your_resend_api_key
NODE_ENV=development
CLIENT_URL=http://localhost:5173
OPENAI_API_KEY=your_openai_api_key_here
```
Run the server:
```bash
npm run dev
```

### 3. Frontend Setup (Client)
Open a new terminal and navigate to the client folder:
```bash
cd client
npm install
```
Create a `.env` file in the `client` directory with the following variables:
```env
VITE_API_URL=http://localhost:5000/api
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_OPENAI_KEY=your_openai_api_key_here
```
Run the client:
```bash
npm run dev
```
The app will be available at `http://localhost:5173`.

## 🤖 Built with Antigravity
*This project was developed using an AI-native agentic coding workflow powered by **Antigravity** (Google DeepMind), showcasing the capability of autonomous coding agents in full-stack architecture, security auditing, and feature implementation.*
