import type { SupabaseClient } from '@supabase/supabase-js';

export type AlertGenerationResult = {
  created: number;
  skipped: number;
  errors: string[];
};

const ALERT_CATEGORIES = ['essays', 'applications', 'letters'];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SupabaseClientLike = any;

export async function generateAlerts(
  supabase: SupabaseClientLike,
  asOfDate: Date = new Date()
): Promise<AlertGenerationResult> {
  const result: AlertGenerationResult = {
    created: 0,
    skipped: 0,
    errors: [],
  };

  const dateStr = asOfDate.toISOString().split('T')[0];

  // Get existing alerts to avoid duplicates
  const { data: existingAlerts } = await supabase
    .from('alerts')
    .select('id, student_id, counselor_id, type, meta') as { data: Array<{ id: string; student_id: string; counselor_id: string; type: string; meta: Record<string, unknown> | null }> | null };

  const existingAlertKeys = new Set(
    (existingAlerts || []).map((a) => {
      if (a.type === 'missed_deadline' && a.meta?.task_id) {
        return `missed_deadline:${a.student_id}:${a.counselor_id}:${a.meta.task_id}`;
      }
      if (a.type === 'weak_essay' && a.meta?.essay_id) {
        return `weak_essay:${a.student_id}:${a.counselor_id}:${a.meta.essay_id}`;
      }
      if (a.type === 'low_engagement') {
        return `low_engagement:${a.student_id}:${a.counselor_id}`;
      }
      return `${a.type}:${a.student_id}:${a.counselor_id}`;
    })
  );

  // MISSED DEADLINE ALERTS
  const { data: overdueTasks } = await supabase
    .from('tasks')
    .select('id, plan_id, title, category, due_date, status')
    .in('category', ALERT_CATEGORIES)
    .lt('due_date', dateStr)
    .neq('status', 'done') as { data: Array<{ id: string; plan_id: string; title: string; category: string; due_date: string; status: string }> | null };

  if (overdueTasks && overdueTasks.length > 0) {
    const planIds = [...new Set(overdueTasks.map((t) => t.plan_id))];
    const { data: plans } = await supabase
      .from('plans')
      .select('id, user_id')
      .in('id', planIds) as { data: Array<{ id: string; user_id: string }> | null };

    if (plans && plans.length > 0) {
      const planToStudent = new Map(plans.map((p) => [p.id, p.user_id]));
      const studentIds = [...new Set(plans.map((p) => p.user_id))];

      const { data: studentProfiles } = await supabase
        .from('profiles')
        .select('user_id, school_id')
        .in('user_id', studentIds)
        .eq('role', 'student') as { data: Array<{ user_id: string; school_id: string | null }> | null };

      if (studentProfiles && studentProfiles.length > 0) {
        const studentToSchool = new Map(
          studentProfiles.filter((p) => p.school_id).map((p) => [p.user_id, p.school_id])
        );

        const schoolIds = [...new Set(studentProfiles.filter((p) => p.school_id).map((p) => p.school_id!))];

        if (schoolIds.length > 0) {
          const { data: counselors } = await supabase
            .from('profiles')
            .select('user_id, school_id')
            .in('school_id', schoolIds)
            .eq('role', 'counselor') as { data: Array<{ user_id: string; school_id: string }> | null };

          if (counselors && counselors.length > 0) {
            const schoolToCounselors = new Map<string, string[]>();
            for (const c of counselors) {
              const list = schoolToCounselors.get(c.school_id) || [];
              list.push(c.user_id);
              schoolToCounselors.set(c.school_id, list);
            }

            const alertsToCreate: Array<{
              student_id: string;
              counselor_id: string;
              type: string;
              meta: { task_id: string; task_title: string };
            }> = [];

            for (const task of overdueTasks) {
              const studentId = planToStudent.get(task.plan_id);
              if (!studentId) continue;

              const schoolId = studentToSchool.get(studentId);
              if (!schoolId) continue;

              const counselorIds = schoolToCounselors.get(schoolId);
              if (!counselorIds) continue;

              for (const counselorId of counselorIds) {
                const key = `missed_deadline:${studentId}:${counselorId}:${task.id}`;
                if (existingAlertKeys.has(key)) {
                  result.skipped++;
                  continue;
                }
                alertsToCreate.push({
                  student_id: studentId,
                  counselor_id: counselorId,
                  type: 'missed_deadline',
                  meta: { task_id: task.id, task_title: task.title },
                });
              }
            }

            if (alertsToCreate.length > 0) {
              await supabase.from('alerts').insert(alertsToCreate);
              result.created = alertsToCreate.length;
            }
          }
        }
      }
    }
  }

  // LOW ENGAGEMENT: Find students with no task completed in 7+ days
  const sevenDaysAgo = new Date(asOfDate);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const sevenDaysAgoStr = sevenDaysAgo.toISOString();

  // Get all students with schools
  const { data: allStudents } = await supabase
    .from('profiles')
    .select('user_id, school_id')
    .eq('role', 'student') as { data: Array<{ user_id: string; school_id: string | null }> | null };

  if (!allStudents) return result;

  const studentsWithSchools = allStudents.filter((s) => s.school_id);
  if (studentsWithSchools.length === 0) return result;

  // Get all plans for these students
  const studentIdsWithSchools = studentsWithSchools.map((s) => s.user_id);
  const { data: allPlans } = await supabase
    .from('plans')
    .select('id, user_id')
    .in('user_id', studentIdsWithSchools) as { data: Array<{ id: string; user_id: string }> | null };

  if (!allPlans || allPlans.length === 0) return result;

  // Get recently completed tasks
  const allPlanIds = allPlans.map((p) => p.id);
  const { data: recentDoneTasks } = await supabase
    .from('tasks')
    .select('id, plan_id, updated_at')
    .in('plan_id', allPlanIds)
    .eq('status', 'done')
    .gte('updated_at', sevenDaysAgoStr) as { data: Array<{ id: string; plan_id: string; updated_at: string }> | null };

  const plansWithRecentActivity = new Set(recentDoneTasks?.map((t) => t.plan_id) || []);
  const planToStudentMap = new Map(allPlans.map((p) => [p.id, p.user_id]));

  // Find students with no recent activity
  const studentsWithRecentActivity = new Set<string>();
  for (const planId of plansWithRecentActivity) {
    const studentId = planToStudentMap.get(planId);
    if (studentId) studentsWithRecentActivity.add(studentId);
  }

  // Get counselors for schools (reuse logic)
  const schoolIdsForEngagement = [...new Set(studentsWithSchools.map((s) => s.school_id!))];
  const { data: counselorsForEngagement } = await supabase
    .from('profiles')
    .select('user_id, school_id')
    .in('school_id', schoolIdsForEngagement)
    .eq('role', 'counselor') as { data: Array<{ user_id: string; school_id: string }> | null };

  if (!counselorsForEngagement || counselorsForEngagement.length === 0) return result;

  const schoolToCounselorsEngagement = new Map<string, string[]>();
  for (const c of counselorsForEngagement) {
    const list = schoolToCounselorsEngagement.get(c.school_id) || [];
    list.push(c.user_id);
    schoolToCounselorsEngagement.set(c.school_id, list);
  }

  const studentToSchoolEngagement = new Map(studentsWithSchools.map((s) => [s.user_id, s.school_id!]));

  // Create low_engagement alerts
  const engagementAlerts: Array<{
    student_id: string;
    counselor_id: string;
    type: string;
    meta: Record<string, unknown>;
  }> = [];

  for (const student of studentsWithSchools) {
    if (studentsWithRecentActivity.has(student.user_id)) continue;

    const schoolId = studentToSchoolEngagement.get(student.user_id);
    if (!schoolId) continue;

    const counselorIds = schoolToCounselorsEngagement.get(schoolId);
    if (!counselorIds) continue;

    for (const counselorId of counselorIds) {
      const key = `low_engagement:${student.user_id}:${counselorId}`;
      if (existingAlertKeys.has(key)) {
        result.skipped++;
        continue;
      }
      engagementAlerts.push({
        student_id: student.user_id,
        counselor_id: counselorId,
        type: 'low_engagement',
        meta: { days_inactive: 7 },
      });
    }
  }

  if (engagementAlerts.length > 0) {
    await supabase.from('alerts').insert(engagementAlerts);
    result.created += engagementAlerts.length;
  }

  // WEAK ESSAY ALERTS: Essays with score < 3 on standard mode
  const { data: weakEssays } = await supabase
    .from('essays')
    .select('id, user_id, mode, feedback')
    .eq('mode', 'standard') as { data: Array<{ id: string; user_id: string; mode: string; feedback: { scores?: { overall?: number } } | null }> | null };

  if (weakEssays && weakEssays.length > 0) {
    const essaysWithLowScore = weakEssays.filter((e) => {
      const score = e.feedback?.scores?.overall;
      return typeof score === 'number' && score < 3;
    });

    if (essaysWithLowScore.length > 0) {
      const essayStudentIds = [...new Set(essaysWithLowScore.map((e) => e.user_id))];

      const { data: essayStudentProfiles } = await supabase
        .from('profiles')
        .select('user_id, school_id')
        .in('user_id', essayStudentIds)
        .eq('role', 'student') as { data: Array<{ user_id: string; school_id: string | null }> | null };

      if (essayStudentProfiles && essayStudentProfiles.length > 0) {
        const essayStudentToSchool = new Map(
          essayStudentProfiles.filter((p) => p.school_id).map((p) => [p.user_id, p.school_id!])
        );

        const essaySchoolIds = [...new Set(
          essayStudentProfiles.filter((p) => p.school_id).map((p) => p.school_id!)
        )];

        if (essaySchoolIds.length > 0) {
          const { data: essayCounselors } = await supabase
            .from('profiles')
            .select('user_id, school_id')
            .in('school_id', essaySchoolIds)
            .eq('role', 'counselor') as { data: Array<{ user_id: string; school_id: string }> | null };

          if (essayCounselors && essayCounselors.length > 0) {
            const essaySchoolToCounselors = new Map<string, string[]>();
            for (const c of essayCounselors) {
              const list = essaySchoolToCounselors.get(c.school_id) || [];
              list.push(c.user_id);
              essaySchoolToCounselors.set(c.school_id, list);
            }

            const weakEssayAlerts: Array<{
              student_id: string;
              counselor_id: string;
              type: string;
              meta: { essay_id: string; score: number };
            }> = [];

            for (const essay of essaysWithLowScore) {
              const schoolId = essayStudentToSchool.get(essay.user_id);
              if (!schoolId) continue;

              const counselorIds = essaySchoolToCounselors.get(schoolId);
              if (!counselorIds) continue;

              for (const counselorId of counselorIds) {
                const key = `weak_essay:${essay.user_id}:${counselorId}:${essay.id}`;
                if (existingAlertKeys.has(key)) {
                  result.skipped++;
                  continue;
                }
                weakEssayAlerts.push({
                  student_id: essay.user_id,
                  counselor_id: counselorId,
                  type: 'weak_essay',
                  meta: { essay_id: essay.id, score: essay.feedback?.scores?.overall ?? 0 },
                });
              }
            }

            if (weakEssayAlerts.length > 0) {
              await supabase.from('alerts').insert(weakEssayAlerts);
              result.created += weakEssayAlerts.length;
            }
          }
        }
      }
    }
  }

  return result;
}
