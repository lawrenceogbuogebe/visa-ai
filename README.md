# Visar - AI-Powered Immigration Petition Platform

A comprehensive full-stack web application for managing and generating immigration petitions (EB-1A, EB-2 NIW, O-1A) using AI-powered document generation with GPT-5.

## Features

### 🎯 Core Functionality
- **Client Management**: Organize and manage immigration clients by visa type
- **AI Petition Generator**: Generate high-quality petition content using GPT-5
- **Template Library**: Pre-built templates for all 10 EB-1A criteria, EB-2 NIW, and O-1A
- **Document Upload**: Upload and manage evidence documents and CVs
- **RAG System**: Retrieval-Augmented Generation using Pinecone vector database
- **Training System**: Upload successful/unsuccessful petitions to improve AI generation
- **Chat Interface**: Interactive AI assistant for drafting petition content
- **Authentication**: Secure user authentication with JWT tokens

### 🎨 Design
- Modern dark glassmorphism UI with brand color (#EF6223)
- Responsive design for all screen sizes
- Space Grotesk for headings, Inter for body text
- Smooth animations and transitions

## Tech Stack

### Backend
- **FastAPI**: Modern Python web framework
- **MongoDB**: Document database with Motor (async driver)
- **Pinecone**: Vector database for RAG implementation
- **OpenAI GPT-5**: AI text generation via Emergent LLM key
- **Sentence Transformers**: Text embeddings for semantic search
- **PyPDF2 & python-docx**: Document text extraction
- **BCrypt**: Password hashing
- **JWT**: Token-based authentication

### Frontend
- **React 19**: Modern UI library
- **React Router**: Client-side routing
- **Axios**: HTTP client
- **Tailwind CSS**: Utility-first CSS framework
- **Shadcn/UI**: High-quality UI components
- **Sonner**: Toast notifications

## Project Structure

```
/app/
├── backend/
│   ├── server.py           # FastAPI application
│   ├── .env                # Environment variables
│   ├── requirements.txt    # Python dependencies
│   └── uploads/            # Document storage
├── frontend/
│   ├── src/
│   │   ├── App.js          # Main React component
│   │   ├── App.css         # Global styles
│   │   ├── pages/
│   │   │   ├── Auth.jsx            # Login/Register
│   │   │   ├── Dashboard.jsx       # Client dashboard
│   │   │   ├── ClientView.jsx      # Client detail view
│   │   │   ├── Templates.jsx       # Template library
│   │   │   └── Training.jsx        # Training documents
│   │   └── components/ui/  # Shadcn UI components
│   ├── package.json        # Node dependencies
│   └── .env                # Environment variables
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js 16+ and Yarn
- Python 3.11+
- MongoDB
- Pinecone API key
- Emergent LLM key (or OpenAI API key)

### 1. Clone and Install

```bash
# Clone the repository
git clone <your-repo-url>
cd visar-platform

# Install backend dependencies
cd backend
pip install -r requirements.txt

# Install frontend dependencies
cd ../frontend
yarn install
```

### 2. Environment Configuration

**Backend (.env)**
```env
MONGO_URL=mongodb://localhost:27017
DB_NAME=visar_immigration_db
CORS_ORIGINS=*
EMERGENT_LLM_KEY=your-emergent-key-here
PINECONE_API_KEY=your-pinecone-key-here
JWT_SECRET=your-secure-jwt-secret-here
```

**Frontend (.env)**
```env
REACT_APP_BACKEND_URL=http://localhost:8001
```

### 3. Run Locally

**Backend:**
```bash
cd backend
uvicorn server:app --host 0.0.0.0 --port 8001 --reload
```

**Frontend:**
```bash
cd frontend
yarn start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8001

## Deployment

### Vercel Deployment (Recommended for Frontend)

1. **Install Vercel CLI:**
```bash
npm install -g vercel
```

2. **Deploy Frontend:**
```bash
cd frontend
vercel
```

3. **Configure Environment Variables in Vercel:**
   - Add `REACT_APP_BACKEND_URL` (your backend API URL)

### Backend Deployment (Railway.app)

```bash
# Install Railway CLI
npm install -g @railway/cli

# Deploy
cd backend
railway login
railway init
railway up
```

Add environment variables in Railway dashboard:
- `MONGO_URL`, `DB_NAME`, `CORS_ORIGINS`, `EMERGENT_LLM_KEY`, `PINECONE_API_KEY`, `JWT_SECRET`

### MongoDB Atlas Setup

1. Create free cluster at mongodb.com/cloud/atlas
2. Get connection string
3. Update `MONGO_URL` in backend environment

## Visa Types Supported

### EB-1A (Extraordinary Ability) - 10 Criteria
Awards, Media, Judging, Original Contributions, Scholarly Articles, Critical Role, High Remuneration, Artistic Exhibitions, Leading Role, Commercial Success

### EB-2 NIW (National Interest Waiver) - 5 Criteria
Advanced Degree, Exceptional Ability, National Importance, Well Positioned, Balance of Interests

### O-1A (Extraordinary Achievement) - 4 Criteria
Extraordinary Achievement, Recognition, Critical Role, Original Contribution

## Cost Estimation

### Monthly Hosting Costs
- **Vercel** (Frontend): $0 (Hobby tier)
- **Railway** (Backend): $5-20
- **MongoDB Atlas**: $0 (Free tier)
- **Pinecone**: $0 (Starter tier)
- **LLM Usage**: $10-50 (varies by usage)

**Total**: $15-70/month

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register
- `POST /api/auth/login` - Login

### Clients
- `GET /api/clients` - List clients
- `POST /api/clients` - Create client
- `GET /api/clients/{id}` - Get client

### Documents
- `POST /api/documents/upload` - Upload document
- `GET /api/documents/{client_id}` - List documents

### Templates
- `GET /api/templates` - List templates
- `POST /api/templates` - Create template

### Petitions
- `POST /api/petitions/generate` - Generate with AI
- `GET /api/petitions/{client_id}` - List petitions

### Training
- `POST /api/training/upload` - Upload training doc
- `GET /api/training/docs` - List training docs

### Chat
- `POST /api/chat/message` - Send message
- `GET /api/chat/history/{client_id}` - Get history

## Security Checklist

- [ ] Change JWT_SECRET to strong random string
- [ ] Use HTTPS in production
- [ ] Enable MongoDB authentication
- [ ] Restrict CORS to your domain
- [ ] Use environment variables for secrets
- [ ] Regular dependency updates

## Troubleshooting

**Backend won't start:**
- Check MongoDB connection
- Verify environment variables
- Check logs

**Frontend build fails:**
- `rm -rf node_modules && yarn install`
- Verify Node.js 16+

**AI generation fails:**
- Verify Emergent LLM key
- Check backend logs
- Ensure Pinecone access

## License

MIT License

## Built With

FastAPI • React • MongoDB • Pinecone • OpenAI GPT-5 • Tailwind CSS • Shadcn/UI
