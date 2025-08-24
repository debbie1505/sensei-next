-- Enable vector extension for embeddings
CREATE EXTENSION IF NOT EXISTS vector;

-- Profiles table (extends auth.users)
CREATE TABLE profiles (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
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

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE essays ENABLE ROW LEVEL SECURITY;
ALTER TABLE plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE kb_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_saves ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

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
