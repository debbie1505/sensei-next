export type MockData = {
  schools: Array<{ id: string; name: string }>;
  profiles: Array<{
    user_id: string;
    role: 'student' | 'counselor' | 'key_person';
    school_id: string | null;
  }>;
  plans: Array<{ id: string; user_id: string; title: string }>;
  tasks: Array<{
    id: string;
    plan_id: string;
    title: string;
    category: string;
    due_date: string;
    status: string;
    updated_at?: string;
  }>;
  alerts: Array<{
    id?: string;
    student_id: string;
    counselor_id: string;
    type: string;
    meta?: Record<string, unknown>;
  }>;
  essays: Array<{
    id: string;
    user_id: string;
    mode: string;
    feedback?: { scores?: { overall?: number } };
  }>;
};

export function createMockSupabase(data: MockData) {
  let alertIdCounter = 1;

  const createQueryBuilder = <T>(tableName: keyof MockData) => {
    let filters: Array<{ column: string; op: string; value: unknown }> = [];
    let insertData: T[] = [];
    let isInsert = false;

    const builder = {
      select: (columns?: string) => builder,
      eq: (column: string, value: unknown) => {
        filters.push({ column, op: 'eq', value });
        return builder;
      },
      lt: (column: string, value: unknown) => {
        filters.push({ column, op: 'lt', value });
        return builder;
      },
      lte: (column: string, value: unknown) => {
        filters.push({ column, op: 'lte', value });
        return builder;
      },
      gt: (column: string, value: unknown) => {
        filters.push({ column, op: 'gt', value });
        return builder;
      },
      gte: (column: string, value: unknown) => {
        filters.push({ column, op: 'gte', value });
        return builder;
      },
      in: (column: string, values: unknown[]) => {
        filters.push({ column, op: 'in', value: values });
        return builder;
      },
      neq: (column: string, value: unknown) => {
        filters.push({ column, op: 'neq', value });
        return builder;
      },
      is: (column: string, value: unknown) => {
        filters.push({ column, op: 'is', value });
        return builder;
      },
      insert: (rows: T | T[]) => {
        isInsert = true;
        insertData = Array.isArray(rows) ? rows : [rows];
        return builder;
      },
      then: async (resolve: (result: { data: T[] | null; error: null }) => void) => {
        if (isInsert) {
          const inserted = insertData.map((row) => ({
            ...row,
            id: `alert-${alertIdCounter++}`,
          }));
          (data[tableName] as unknown[]).push(...inserted);
          resolve({ data: inserted as T[], error: null });
          return;
        }

        let result = [...(data[tableName] as unknown[])] as T[];

        for (const filter of filters) {
          result = result.filter((row: Record<string, unknown>) => {
            const val = row[filter.column];
            switch (filter.op) {
              case 'eq':
                return val === filter.value;
              case 'neq':
                return val !== filter.value;
              case 'lt':
                return val < (filter.value as number | string);
              case 'lte':
                return val <= (filter.value as number | string);
              case 'gt':
                return val > (filter.value as number | string);
              case 'gte':
                return val >= (filter.value as number | string);
              case 'in':
                return (filter.value as unknown[]).includes(val);
              case 'is':
                return val === filter.value;
              default:
                return true;
            }
          });
        }

        resolve({ data: result, error: null });
      },
    };

    return builder;
  };

  return {
    from: (table: string) => createQueryBuilder(table as keyof MockData),
  };
}
