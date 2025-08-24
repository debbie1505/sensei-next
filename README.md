# Sensei - Your AI College Mentor

A comprehensive college application platform that provides personalized essay feedback, timeline generation, and scholarship matching using AI.

## 🚀 Features

### Core Features
- **AI Essay Review**: Structured feedback with rubric scoring and revision suggestions
- **Personalized Timeline**: AI-generated application timelines with task management
- **Scholarship Matching**: Curated and AI-generated scholarship recommendations
- **User Profiles**: Comprehensive student profiles for personalized recommendations

### Technical Features
- **Modern Stack**: Next.js 15, TypeScript, Tailwind CSS
- **Authentication**: Supabase Auth with protected routes
- **Database**: PostgreSQL with Row Level Security (RLS)
- **AI Integration**: OpenAI GPT-4 for intelligent recommendations
- **Real-time**: Server-side rendering with streaming support

## 🏗️ Architecture

### Project Structure
```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   │   ├── essay/         # Essay review endpoints
│   │   ├── timeline/      # Timeline generation
│   │   └── scholarships/  # Scholarship matching
│   ├── dashboard/         # Main dashboard
│   ├── essay/            # Essay review page
│   ├── timeline/         # Timeline management
│   └── scholarships/     # Scholarship search
├── components/           # React components
├── features/            # Feature-specific components
├── llm/                 # AI/LLM integration
│   ├── provider.ts      # OpenAI wrapper
│   └── router.ts        # Tool routing
└── utils/               # Utilities
    └── supabase/        # Database client
```

### Database Schema
- **profiles**: User profile data
- **essays**: Essay submissions with AI feedback
- **plans**: Timeline containers
- **tasks**: Individual timeline items
- **kb_items**: Curated scholarships/programs
- **user_saves**: User bookmarks

## 🛠️ Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account
- OpenAI API key

### 1. Clone and Install
```bash
git clone <repository-url>
cd sensei-next
npm install
```

### 2. Environment Variables
Create a `.env.local` file:
```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# OpenAI Configuration
NEXT_PUBLIC_OPENAI_API_KEY=your_openai_api_key

# Site URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 3. Database Setup
1. Create a new Supabase project
2. Run the SQL from `database-schema.sql` in your Supabase SQL editor
3. Enable Row Level Security (RLS) on all tables
4. Set up the authentication policies

### 4. Development
```bash
npm run dev
```

Visit `http://localhost:3000` to see your app.

## 📊 Key Metrics

Track these metrics for success:
- **Activation**: Users who create their first timeline
- **Engagement**: Essays with revisions applied
- **Retention**: D7/D30 user retention
- **Completion**: Tasks completed per user per week
- **Conversion**: Scholarship clicks and saves

## 🔒 Security & Privacy

- **RLS Policies**: All user data is protected by Row Level Security
- **No PII Storage**: Sensitive data like SSNs are never stored
- **API Security**: All AI calls are server-side only
- **Environment Variables**: Secrets are properly managed

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository
2. Add environment variables
3. Deploy automatically on push

### Other Platforms
- **Netlify**: Similar to Vercel setup
- **Railway**: Good for full-stack apps
- **AWS/GCP**: For enterprise deployments

## 📈 Roadmap

### Phase 1 (Current)
- ✅ Essay review with structured feedback
- ✅ Timeline generation and management
- ✅ Basic scholarship matching
- ✅ User authentication and profiles

### Phase 2 (Next 30 days)
- [ ] Notifications and reminders
- [ ] Enhanced diff UI for essay revisions
- [ ] Basic analytics dashboard
- [ ] Export functionality (PDF)

### Phase 3 (Next 60 days)
- [ ] Advanced scholarship matching with embeddings
- [ ] Counselor share links
- [ ] Mobile app optimization
- [ ] Advanced analytics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support, email support@sensei.com or create an issue in this repository.

---

**Built with ❤️ for students navigating the college application process.**
