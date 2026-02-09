export type ProfileRole = "student" | "counselor" | "key_person";

export type Profile = {
  user_id: string;
  role?: ProfileRole | null;
  school_id?: string | null;
  grade?: number | null;
  gpa?: number | null;
  major_interests?: string[] | null;
  state?: string | null;
  citizenship?: string | null;
  applicant_type?: string | null;
  college_type?: string | null;
  goals?: string | null;
  created_at?: string;
  updated_at?: string;
};
