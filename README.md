# Admitra - College Application Management for Counselors & Schools

A centralized platform that helps counselors manage applications at scale and helps students submit stronger, more competitive applications. B2B2C: schools license Admitra; counselors oversee students; students use one workspace for applications, essays, and timelines.

## Features

### For counselors
- **Caseload view**: See all students in your school, with at-a-glance status
- **Alerts**: Missed deadlines, low engagement, and essay risk flags
- **Student detail**: Essays, timeline, and counselor notes per student
- **Feedback tools**: Inline essay comments and approval workflow (coming soon)

### For students
- **AI Essay Review**: Structured feedback with rubric scoring and revision suggestions
- **Timeline**: AI-generated application timelines with task management
- **Scholarship matching**: Curated and AI-generated scholarship recommendations
- **One workspace**: Applications, essays, and deadlines in one place

### For teachers / recommenders (key people)
- **Assigned students only**: Essay reviewer or LOR writer role per student
- **Task-based access**: Only the materials needed for your role

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
- **profiles**: User profile data (role: student, counselor, key_person; optional school_id)
- **schools**: Schools for B2B licensing
- **essays**: Essay submissions with AI feedback
- **plans**: Timeline containers
- **tasks**: Individual timeline items
- **kb_items**: Curated scholarships/programs
- **user_saves**: User bookmarks
- **key_person_assignments**: Teacher/recommender assignments (essay_reviewer, lor_writer)
- **alerts**: Counselor alerts (missed_deadline, low_engagement, weak_essay)

## 🛠️ Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account
- OpenAI API key

### 1. Clone and Install
```bash
git clone <repository-url>
cd admitra
npm install
```

### 2. Environment Variables
Create a `.env.local` file:
```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key

# Site URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Cron job authentication (generate a random string)
CRON_SECRET=your_cron_secret
```

### 3. Database Setup
1. Create a new Supabase project
2. Run the SQL from `database-schema.sql` in your Supabase SQL editor (or apply migrations in `supabase/migrations/`)
3. RLS is defined in the schema; ensure auth is configured

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

### Cron Jobs
Alert generation runs daily at 8 AM UTC via Vercel Cron. Configuration is in `vercel.json`.

To test locally:
```bash
curl -H "Authorization: Bearer $CRON_SECRET" http://localhost:3000/api/cron/alerts
```

## Roadmap

### Current
- Counselor and key-person dashboards (caseload, assigned students)
- Role-based onboarding (student, counselor, teacher/recommender)
- Essay review, timeline, and scholarship matching for students
- Schools and alerts schema; RLS for multi-tenant readiness
- Alert generation (missed deadlines, low engagement, weak essays)

### Next
- Counselor notes and essay feedback workflow
- Key person essay/LOR views and commenting
- School admin and invite flows

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support or to pilot Admitra at your school, email **hello@admitra.com** or open an issue in this repository.

---

**Built for counselors and students.**
