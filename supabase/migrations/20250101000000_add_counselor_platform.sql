-- Counselor-centered platform: roles, schools, key people, alerts

-- Schools (B2B: schools license Sensei)
CREATE TABLE IF NOT EXISTS schools (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add role and school to profiles (run on existing DB)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'role') THEN
    ALTER TABLE profiles ADD COLUMN role text CHECK (role IN ('student', 'counselor', 'key_person'));
    UPDATE profiles SET role = 'student' WHERE role IS NULL;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'school_id') THEN
    ALTER TABLE profiles ADD COLUMN school_id uuid REFERENCES schools(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Key person assignments (teachers: essay reviewer, LOR writer)
CREATE TABLE IF NOT EXISTS key_person_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key_person_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('essay_reviewer', 'lor_writer')),
  created_at timestamptz DEFAULT now(),
  UNIQUE(key_person_id, student_id, role)
);

CREATE INDEX IF NOT EXISTS idx_key_person_assignments_key_person ON key_person_assignments(key_person_id);
CREATE INDEX IF NOT EXISTS idx_key_person_assignments_student ON key_person_assignments(student_id);

-- Alerts for counselors (missed deadline, low engagement, weak essay)
CREATE TABLE IF NOT EXISTS alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  counselor_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('missed_deadline', 'low_engagement', 'weak_essay', 'other')),
  meta jsonb,
  read_at timestamptz,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_alerts_counselor ON alerts(counselor_id);
CREATE INDEX IF NOT EXISTS idx_alerts_student ON alerts(student_id);
CREATE INDEX IF NOT EXISTS idx_alerts_created_at ON alerts(created_at DESC);

-- RLS for new tables
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE key_person_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;

-- Schools: counselors and admins of that school can read; service role for writes for now
CREATE POLICY "Users can view own school" ON schools FOR SELECT
  USING (id IN (SELECT school_id FROM profiles WHERE user_id = auth.uid() AND school_id IS NOT NULL));

-- Key person: key person sees their assignments, student sees assignments where they are the student
CREATE POLICY "Key person views own assignments" ON key_person_assignments FOR SELECT
  USING (key_person_id = auth.uid());
CREATE POLICY "Key person insert own" ON key_person_assignments FOR INSERT WITH CHECK (key_person_id = auth.uid());
CREATE POLICY "Student views assignments to them" ON key_person_assignments FOR SELECT
  USING (student_id = auth.uid());
-- Students can create assignment requests (key_person_id is the assigned person)
CREATE POLICY "Student can insert assignment" ON key_person_assignments FOR INSERT WITH CHECK (student_id = auth.uid());

-- Alerts: counselor sees their alerts
CREATE POLICY "Counselor views own alerts" ON alerts FOR SELECT USING (counselor_id = auth.uid());
CREATE POLICY "Counselor updates own alerts" ON alerts FOR UPDATE USING (counselor_id = auth.uid());
-- Insert via service/backend when generating alerts

-- Trigger for schools updated_at
CREATE TRIGGER update_schools_updated_at BEFORE UPDATE ON schools FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
