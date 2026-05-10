-- Admitra application system core entities and RLS

-- Application colleges per student
CREATE TABLE IF NOT EXISTS application_colleges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  school_name text NOT NULL,
  application_round text,
  deadline date,
  status text NOT NULL DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'submitted', 'withdrawn')),
  progress integer NOT NULL DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Requirements checklist per school
CREATE TABLE IF NOT EXISTS application_requirements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  college_id uuid NOT NULL REFERENCES application_colleges(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('essay', 'recommendation_letter', 'transcript', 'test_score', 'portfolio', 'other')),
  title text NOT NULL,
  status text NOT NULL DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'requested', 'submitted')),
  due_date date,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Recommenders added by a student
CREATE TABLE IF NOT EXISTS recommenders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text,
  relationship text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Recommendation request tracking
CREATE TABLE IF NOT EXISTS recommendation_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  college_id uuid REFERENCES application_colleges(id) ON DELETE SET NULL,
  recommender_id uuid NOT NULL REFERENCES recommenders(id) ON DELETE CASCADE,
  requested_date date,
  due_date date,
  status text NOT NULL DEFAULT 'not_requested' CHECK (status IN ('not_requested', 'requested', 'submitted', 'declined')),
  last_reminded_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Essay version history
CREATE TABLE IF NOT EXISTS essay_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  essay_id uuid NOT NULL REFERENCES essays(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  version_number integer NOT NULL CHECK (version_number > 0),
  draft text NOT NULL,
  source text NOT NULL DEFAULT 'manual',
  created_at timestamptz DEFAULT now(),
  UNIQUE(essay_id, version_number)
);

-- Structured comments on essays
CREATE TABLE IF NOT EXISTS essay_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  essay_id uuid NOT NULL REFERENCES essays(id) ON DELETE CASCADE,
  commenter_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  commenter_role text NOT NULL CHECK (commenter_role IN ('student', 'counselor', 'key_person', 'mentor')),
  target_text text,
  comment text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Resolution state for comments
CREATE TABLE IF NOT EXISTS essay_comment_resolutions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  comment_id uuid NOT NULL UNIQUE REFERENCES essay_comments(id) ON DELETE CASCADE,
  essay_id uuid NOT NULL REFERENCES essays(id) ON DELETE CASCADE,
  resolver_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'resolved', 'ignored')),
  note text,
  resolved_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Extend tasks with links to application entities
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'tasks' AND column_name = 'college_id') THEN
    ALTER TABLE tasks ADD COLUMN college_id uuid REFERENCES application_colleges(id) ON DELETE SET NULL;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'tasks' AND column_name = 'requirement_id') THEN
    ALTER TABLE tasks ADD COLUMN requirement_id uuid REFERENCES application_requirements(id) ON DELETE SET NULL;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'tasks' AND column_name = 'essay_id') THEN
    ALTER TABLE tasks ADD COLUMN essay_id uuid REFERENCES essays(id) ON DELETE SET NULL;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'tasks' AND column_name = 'reminder_state') THEN
    ALTER TABLE tasks ADD COLUMN reminder_state text DEFAULT 'none' CHECK (reminder_state IN ('none', 'due_soon', 'behind', 'overdue'));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'tasks' AND column_name = 'week_label') THEN
    ALTER TABLE tasks ADD COLUMN week_label text;
  END IF;
END $$;

-- RLS enablement
ALTER TABLE application_colleges ENABLE ROW LEVEL SECURITY;
ALTER TABLE application_requirements ENABLE ROW LEVEL SECURITY;
ALTER TABLE recommenders ENABLE ROW LEVEL SECURITY;
ALTER TABLE recommendation_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE essay_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE essay_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE essay_comment_resolutions ENABLE ROW LEVEL SECURITY;

-- Ownership policies
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users own application colleges' AND tablename = 'application_colleges') THEN
    CREATE POLICY "Users own application colleges" ON application_colleges FOR ALL
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users own application requirements' AND tablename = 'application_requirements') THEN
    CREATE POLICY "Users own application requirements" ON application_requirements FOR ALL
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users own recommenders' AND tablename = 'recommenders') THEN
    CREATE POLICY "Users own recommenders" ON recommenders FOR ALL
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users own recommendation requests' AND tablename = 'recommendation_requests') THEN
    CREATE POLICY "Users own recommendation requests" ON recommendation_requests FOR ALL
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users own essay versions' AND tablename = 'essay_versions') THEN
    CREATE POLICY "Users own essay versions" ON essay_versions FOR ALL
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- Collaboration-aware comment policies
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Essay comments readable by participants' AND tablename = 'essay_comments') THEN
    CREATE POLICY "Essay comments readable by participants" ON essay_comments FOR SELECT
      USING (
        commenter_id = auth.uid()
        OR EXISTS (
          SELECT 1 FROM essays e
          WHERE e.id = essay_comments.essay_id
            AND e.user_id = auth.uid()
        )
      );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Essay comments insert by commenter' AND tablename = 'essay_comments') THEN
    CREATE POLICY "Essay comments insert by commenter" ON essay_comments FOR INSERT
      WITH CHECK (
        commenter_id = auth.uid()
        AND EXISTS (
          SELECT 1 FROM essays e
          WHERE e.id = essay_comments.essay_id
        )
      );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Essay comment resolutions readable by participants' AND tablename = 'essay_comment_resolutions') THEN
    CREATE POLICY "Essay comment resolutions readable by participants" ON essay_comment_resolutions FOR SELECT
      USING (
        resolver_id = auth.uid()
        OR EXISTS (
          SELECT 1 FROM essays e
          WHERE e.id = essay_comment_resolutions.essay_id
            AND e.user_id = auth.uid()
        )
      );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Essay comment resolutions managed by resolver' AND tablename = 'essay_comment_resolutions') THEN
    CREATE POLICY "Essay comment resolutions managed by resolver" ON essay_comment_resolutions FOR ALL
      USING (resolver_id = auth.uid())
      WITH CHECK (resolver_id = auth.uid());
  END IF;
END $$;

-- Useful indexes
CREATE INDEX IF NOT EXISTS idx_application_colleges_user_id ON application_colleges(user_id);
CREATE INDEX IF NOT EXISTS idx_application_colleges_status ON application_colleges(status);
CREATE INDEX IF NOT EXISTS idx_application_requirements_user_id ON application_requirements(user_id);
CREATE INDEX IF NOT EXISTS idx_application_requirements_college_id ON application_requirements(college_id);
CREATE INDEX IF NOT EXISTS idx_application_requirements_status ON application_requirements(status);
CREATE INDEX IF NOT EXISTS idx_recommenders_user_id ON recommenders(user_id);
CREATE INDEX IF NOT EXISTS idx_recommendation_requests_user_id ON recommendation_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_recommendation_requests_college_id ON recommendation_requests(college_id);
CREATE INDEX IF NOT EXISTS idx_recommendation_requests_status ON recommendation_requests(status);
CREATE INDEX IF NOT EXISTS idx_essay_versions_essay_id ON essay_versions(essay_id);
CREATE INDEX IF NOT EXISTS idx_essay_comments_essay_id ON essay_comments(essay_id);
CREATE INDEX IF NOT EXISTS idx_essay_comment_resolutions_essay_id ON essay_comment_resolutions(essay_id);
CREATE INDEX IF NOT EXISTS idx_tasks_college_id ON tasks(college_id);
CREATE INDEX IF NOT EXISTS idx_tasks_requirement_id ON tasks(requirement_id);
CREATE INDEX IF NOT EXISTS idx_tasks_essay_id ON tasks(essay_id);
CREATE INDEX IF NOT EXISTS idx_tasks_reminder_state ON tasks(reminder_state);

-- updated_at triggers
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_application_colleges_updated_at') THEN
    CREATE TRIGGER update_application_colleges_updated_at BEFORE UPDATE ON application_colleges
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_application_requirements_updated_at') THEN
    CREATE TRIGGER update_application_requirements_updated_at BEFORE UPDATE ON application_requirements
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_recommenders_updated_at') THEN
    CREATE TRIGGER update_recommenders_updated_at BEFORE UPDATE ON recommenders
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_recommendation_requests_updated_at') THEN
    CREATE TRIGGER update_recommendation_requests_updated_at BEFORE UPDATE ON recommendation_requests
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_essay_comment_resolutions_updated_at') THEN
    CREATE TRIGGER update_essay_comment_resolutions_updated_at BEFORE UPDATE ON essay_comment_resolutions
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;
