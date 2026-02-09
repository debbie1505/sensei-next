-- Enable vector extension for embeddings
CREATE EXTENSION IF NOT EXISTS vector;

-- Schools (B2B: schools license Sensei)
CREATE TABLE schools (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Profiles table (extends auth.users)
CREATE TABLE profiles (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role text CHECK (role IN ('student', 'counselor', 'key_person')),
  school_id uuid REFERENCES schools(id) ON DELETE SET NULL,
  grade int CHECK (grade BETWEEN 8 AND 16),
  gpa numeric(3,2) CHECK (gpa BETWEEN 0.0 AND 4.0),
  major_interests text[],
  state text,
  citizenship text,
  applicant_type text,
  college_type text,
  goals text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Essays table
CREATE TABLE essays (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  prompt text,
  draft text NOT NULL,
  mode text CHECK (mode IN ('light', 'standard', 'rewrite')),
  feedback jsonb, -- structured feedback with scores, actions, etc.
  revised text,
  rating integer CHECK (rating BETWEEN 1 AND 5), -- user feedback
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Plans table (timeline containers)
CREATE TABLE plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  start_date date,
  end_date date,
  meta jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Tasks table (individual timeline items)
CREATE TABLE tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id uuid REFERENCES plans(id) ON DELETE CASCADE,
  title text NOT NULL,
  due_date date,
  start_date date,
  status text CHECK (status IN ('todo', 'doing', 'done', 'blocked')) DEFAULT 'todo',
  priority text CHECK (priority IN ('low', 'medium', 'high')) DEFAULT 'medium',
  category text CHECK (category IN ('testing', 'essays', 'letters', 'applications', 'financial_aid', 'extracurriculars', 'interviews', 'research', 'other')),
  description text,
  notes text,
  school text,
  program text,
  tags text[],
  blockers text[],
  links text[],
  subtasks jsonb,
  source jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Knowledge base items (curated scholarships/programs)
CREATE TABLE kb_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kind text CHECK (kind IN ('scholarship', 'program')),
  title text NOT NULL,
  description text,
  url text,
  tags text[],
  deadline date,
  amount integer, -- in dollars
  eligibility jsonb,
  embedding vector(1536),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- User saved items (bookmarks)
CREATE TABLE user_saves (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  kb_item_id uuid REFERENCES kb_items(id) ON DELETE CASCADE,
  notes text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, kb_item_id)
);

-- Waitlist table
CREATE TABLE waitlist (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Key person assignments (teachers: essay reviewer, LOR writer)
CREATE TABLE key_person_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key_person_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('essay_reviewer', 'lor_writer')),
  created_at timestamptz DEFAULT now(),
  UNIQUE(key_person_id, student_id, role)
);

-- Alerts for counselors (missed deadline, low engagement, weak essay)
CREATE TABLE alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  counselor_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('missed_deadline', 'low_engagement', 'weak_essay', 'other')),
  meta jsonb,
  read_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE essays ENABLE ROW LEVEL SECURITY;
ALTER TABLE plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE kb_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_saves ENABLE ROW LEVEL SECURITY;
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE key_person_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Counselors can view student profiles in their school
CREATE POLICY "Counselors can view students in own school" ON profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles AS counselor
      WHERE counselor.user_id = auth.uid()
        AND counselor.role = 'counselor'
        AND counselor.school_id IS NOT NULL
        AND counselor.school_id = profiles.school_id
        AND profiles.role = 'student'
    )
  );

-- Essays policies
CREATE POLICY "Users can view own essays" ON essays FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own essays" ON essays FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own essays" ON essays FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own essays" ON essays FOR DELETE USING (auth.uid() = user_id);

-- Plans policies
CREATE POLICY "Users can view own plans" ON plans FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own plans" ON plans FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own plans" ON plans FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own plans" ON plans FOR DELETE USING (auth.uid() = user_id);

-- Tasks policies (through plan ownership)
CREATE POLICY "Users can view tasks in own plans" ON tasks FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM plans WHERE plans.id = tasks.plan_id AND plans.user_id = auth.uid()
  ));
CREATE POLICY "Users can insert tasks in own plans" ON tasks FOR INSERT 
  WITH CHECK (EXISTS (
    SELECT 1 FROM plans WHERE plans.id = tasks.plan_id AND plans.user_id = auth.uid()
  ));
CREATE POLICY "Users can update tasks in own plans" ON tasks FOR UPDATE 
  USING (EXISTS (
    SELECT 1 FROM plans WHERE plans.id = tasks.plan_id AND plans.user_id = auth.uid()
  ));
CREATE POLICY "Users can delete tasks in own plans" ON tasks FOR DELETE 
  USING (EXISTS (
    SELECT 1 FROM plans WHERE plans.id = tasks.plan_id AND plans.user_id = auth.uid()
  ));

-- KB items policies (public read, admin write)
CREATE POLICY "Anyone can view kb_items" ON kb_items FOR SELECT USING (true);
-- Note: Insert/update/delete policies would be added for admin users

-- User saves policies
CREATE POLICY "Users can view own saves" ON user_saves FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own saves" ON user_saves FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own saves" ON user_saves FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own saves" ON user_saves FOR DELETE USING (auth.uid() = user_id);

-- Waitlist policies (public insert, admin read)
CREATE POLICY "Anyone can join waitlist" ON waitlist FOR INSERT WITH CHECK (true);

-- Schools: users can view their own school
CREATE POLICY "Users can view own school" ON schools FOR SELECT
  USING (id IN (SELECT school_id FROM profiles WHERE user_id = auth.uid() AND school_id IS NOT NULL));

-- Key person assignments: key person and student can view
CREATE POLICY "Key person views own assignments" ON key_person_assignments FOR SELECT USING (key_person_id = auth.uid());
CREATE POLICY "Key person insert own" ON key_person_assignments FOR INSERT WITH CHECK (key_person_id = auth.uid());
CREATE POLICY "Student views assignments to them" ON key_person_assignments FOR SELECT USING (student_id = auth.uid());
CREATE POLICY "Student can insert assignment" ON key_person_assignments FOR INSERT WITH CHECK (student_id = auth.uid());

-- Alerts: counselor sees own alerts
CREATE POLICY "Counselor views own alerts" ON alerts FOR SELECT USING (counselor_id = auth.uid());
CREATE POLICY "Counselor updates own alerts" ON alerts FOR UPDATE USING (counselor_id = auth.uid());

-- Indexes for performance
CREATE INDEX idx_essays_user_id ON essays(user_id);
CREATE INDEX idx_essays_created_at ON essays(created_at);
CREATE INDEX idx_plans_user_id ON plans(user_id);
CREATE INDEX idx_tasks_plan_id ON tasks(plan_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);
CREATE INDEX idx_kb_items_kind ON kb_items(kind);
CREATE INDEX idx_kb_items_tags ON kb_items USING GIN(tags);
CREATE INDEX idx_kb_items_deadline ON kb_items(deadline);
CREATE INDEX idx_user_saves_user_id ON user_saves(user_id);
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_school_id ON profiles(school_id);
CREATE INDEX idx_key_person_assignments_key_person ON key_person_assignments(key_person_id);
CREATE INDEX idx_key_person_assignments_student ON key_person_assignments(student_id);
CREATE INDEX idx_alerts_counselor ON alerts(counselor_id);
CREATE INDEX idx_alerts_student ON alerts(student_id);
CREATE INDEX idx_alerts_created_at ON alerts(created_at DESC);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_essays_updated_at BEFORE UPDATE ON essays FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_plans_updated_at BEFORE UPDATE ON plans FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_kb_items_updated_at BEFORE UPDATE ON kb_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_schools_updated_at BEFORE UPDATE ON schools FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
