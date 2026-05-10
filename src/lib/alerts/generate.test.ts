import { describe, it, expect, beforeEach } from 'vitest';
import { generateAlerts, type AlertGenerationResult } from './generate';
import { createMockSupabase, type MockData } from './test-utils';

describe('generateAlerts', () => {
  const TODAY = new Date('2026-05-10');
  const TWO_DAYS_AGO = new Date('2026-05-08');
  const EIGHT_DAYS_AGO = new Date('2026-05-02');

  describe('missed_deadline alerts', () => {
    it('creates alert when task is 1+ days overdue in essays category', async () => {
      const mockData: MockData = {
        schools: [{ id: 'school-1', name: 'Test High School' }],
        profiles: [
          { user_id: 'student-1', role: 'student', school_id: 'school-1' },
          { user_id: 'counselor-1', role: 'counselor', school_id: 'school-1' },
        ],
        plans: [{ id: 'plan-1', user_id: 'student-1', title: 'My Plan' }],
        tasks: [
          {
            id: 'task-1',
            plan_id: 'plan-1',
            title: 'Write Common App essay',
            category: 'essays',
            due_date: TWO_DAYS_AGO.toISOString().split('T')[0],
            status: 'todo',
          },
        ],
        alerts: [],
        essays: [],
      };

      const supabase = createMockSupabase(mockData);
      const result = await generateAlerts(supabase, TODAY);

      const deadlineAlerts = mockData.alerts.filter((a) => a.type === 'missed_deadline');
      expect(deadlineAlerts).toHaveLength(1);
      expect(deadlineAlerts[0]).toMatchObject({
        student_id: 'student-1',
        counselor_id: 'counselor-1',
        type: 'missed_deadline',
      });
    });

    it('does NOT create alert for overdue task in research category', async () => {
      const mockData: MockData = {
        schools: [{ id: 'school-1', name: 'Test High School' }],
        profiles: [
          { user_id: 'student-1', role: 'student', school_id: 'school-1' },
          { user_id: 'counselor-1', role: 'counselor', school_id: 'school-1' },
        ],
        plans: [{ id: 'plan-1', user_id: 'student-1', title: 'My Plan' }],
        tasks: [
          {
            id: 'task-1',
            plan_id: 'plan-1',
            title: 'Research colleges',
            category: 'research',
            due_date: TWO_DAYS_AGO.toISOString().split('T')[0],
            status: 'todo',
          },
        ],
        alerts: [],
        essays: [],
      };

      const supabase = createMockSupabase(mockData);
      const result = await generateAlerts(supabase, TODAY);

      const deadlineAlerts = mockData.alerts.filter((a) => a.type === 'missed_deadline');
      expect(deadlineAlerts).toHaveLength(0);
    });
  });

  describe('low_engagement alerts', () => {
    it('creates alert when student has no task done in 7+ days', async () => {
      const mockData: MockData = {
        schools: [{ id: 'school-1', name: 'Test High School' }],
        profiles: [
          { user_id: 'student-1', role: 'student', school_id: 'school-1' },
          { user_id: 'counselor-1', role: 'counselor', school_id: 'school-1' },
        ],
        plans: [{ id: 'plan-1', user_id: 'student-1', title: 'My Plan' }],
        tasks: [
          {
            id: 'task-1',
            plan_id: 'plan-1',
            title: 'Some task',
            category: 'essays',
            due_date: '2026-06-01',
            status: 'todo',
            updated_at: EIGHT_DAYS_AGO.toISOString(),
          },
        ],
        alerts: [],
        essays: [],
      };

      const supabase = createMockSupabase(mockData);
      const result = await generateAlerts(supabase, TODAY);

      const engagementAlerts = mockData.alerts.filter((a) => a.type === 'low_engagement');
      expect(engagementAlerts).toHaveLength(1);
      expect(engagementAlerts[0]).toMatchObject({
        student_id: 'student-1',
        counselor_id: 'counselor-1',
        type: 'low_engagement',
      });
    });
  });

  describe('weak_essay alerts', () => {
    it('creates alert when essay has AI score < 3 on standard mode', async () => {
      const mockData: MockData = {
        schools: [{ id: 'school-1', name: 'Test High School' }],
        profiles: [
          { user_id: 'student-1', role: 'student', school_id: 'school-1' },
          { user_id: 'counselor-1', role: 'counselor', school_id: 'school-1' },
        ],
        plans: [{ id: 'plan-1', user_id: 'student-1', title: 'My Plan' }],
        tasks: [
          {
            id: 'task-1',
            plan_id: 'plan-1',
            title: 'Task',
            category: 'essays',
            due_date: '2026-06-01',
            status: 'done',
            updated_at: TODAY.toISOString(),
          },
        ],
        alerts: [],
        essays: [
          {
            id: 'essay-1',
            user_id: 'student-1',
            mode: 'standard',
            feedback: { scores: { overall: 2 } },
          },
        ],
      };

      const supabase = createMockSupabase(mockData);
      const result = await generateAlerts(supabase, TODAY);

      const weakEssayAlerts = mockData.alerts.filter((a) => a.type === 'weak_essay');
      expect(weakEssayAlerts).toHaveLength(1);
      expect(weakEssayAlerts[0]).toMatchObject({
        student_id: 'student-1',
        counselor_id: 'counselor-1',
        type: 'weak_essay',
      });
    });
  });

  describe('B2C students (no school)', () => {
    it('does NOT create alert for student without school', async () => {
      const mockData: MockData = {
        schools: [],
        profiles: [
          { user_id: 'student-1', role: 'student', school_id: null },
        ],
        plans: [{ id: 'plan-1', user_id: 'student-1', title: 'My Plan' }],
        tasks: [
          {
            id: 'task-1',
            plan_id: 'plan-1',
            title: 'Overdue essay',
            category: 'essays',
            due_date: TWO_DAYS_AGO.toISOString().split('T')[0],
            status: 'todo',
          },
        ],
        alerts: [],
        essays: [],
      };

      const supabase = createMockSupabase(mockData);
      const result = await generateAlerts(supabase, TODAY);

      expect(mockData.alerts).toHaveLength(0);
    });
  });

  describe('deduplication', () => {
    it('creates one alert per overdue task (not one per student)', async () => {
      const mockData: MockData = {
        schools: [{ id: 'school-1', name: 'Test High School' }],
        profiles: [
          { user_id: 'student-1', role: 'student', school_id: 'school-1' },
          { user_id: 'counselor-1', role: 'counselor', school_id: 'school-1' },
        ],
        plans: [{ id: 'plan-1', user_id: 'student-1', title: 'My Plan' }],
        tasks: [
          {
            id: 'task-1',
            plan_id: 'plan-1',
            title: 'Essay 1',
            category: 'essays',
            due_date: TWO_DAYS_AGO.toISOString().split('T')[0],
            status: 'todo',
          },
          {
            id: 'task-2',
            plan_id: 'plan-1',
            title: 'Essay 2',
            category: 'essays',
            due_date: TWO_DAYS_AGO.toISOString().split('T')[0],
            status: 'todo',
          },
        ],
        alerts: [],
        essays: [],
      };

      const supabase = createMockSupabase(mockData);
      const result = await generateAlerts(supabase, TODAY);

      const deadlineAlerts = mockData.alerts.filter((a) => a.type === 'missed_deadline');
      expect(deadlineAlerts).toHaveLength(2);
      expect(deadlineAlerts[0].meta).toHaveProperty('task_id', 'task-1');
      expect(deadlineAlerts[1].meta).toHaveProperty('task_id', 'task-2');
    });

    it('does NOT create duplicate alert for same task on re-run', async () => {
      const mockData: MockData = {
        schools: [{ id: 'school-1', name: 'Test High School' }],
        profiles: [
          { user_id: 'student-1', role: 'student', school_id: 'school-1' },
          { user_id: 'counselor-1', role: 'counselor', school_id: 'school-1' },
        ],
        plans: [{ id: 'plan-1', user_id: 'student-1', title: 'My Plan' }],
        tasks: [
          {
            id: 'task-1',
            plan_id: 'plan-1',
            title: 'Essay 1',
            category: 'essays',
            due_date: TWO_DAYS_AGO.toISOString().split('T')[0],
            status: 'todo',
          },
        ],
        alerts: [
          {
            id: 'existing-alert',
            student_id: 'student-1',
            counselor_id: 'counselor-1',
            type: 'missed_deadline',
            meta: { task_id: 'task-1', task_title: 'Essay 1' },
          },
        ],
        essays: [],
      };

      const supabase = createMockSupabase(mockData);
      const result = await generateAlerts(supabase, TODAY);

      const deadlineAlerts = mockData.alerts.filter((a) => a.type === 'missed_deadline');
      expect(deadlineAlerts).toHaveLength(1); // Still only 1, not 2
      expect(result.skipped).toBe(1);
    });
  });
});
