"use client";

import { env } from "@/env/client";

export type MockRole = "student" | "counselor" | "key_person";

export type MockAccount = {
  id: string;
  email: string;
  password: string;
  role: MockRole;
  displayName: string;
};

export const MOCK_ACCOUNTS: Record<MockRole, MockAccount> = {
  student: {
    id: "00000000-0000-0000-0000-000000000101",
    email: "student@admitra.dev",
    password: "Admitra123!",
    role: "student",
    displayName: "Student Demo",
  },
  counselor: {
    id: "00000000-0000-0000-0000-000000000102",
    email: "counselor@admitra.dev",
    password: "Admitra123!",
    role: "counselor",
    displayName: "Counselor Demo",
  },
  key_person: {
    id: "00000000-0000-0000-0000-000000000103",
    email: "teacher@admitra.dev",
    password: "Admitra123!",
    role: "key_person",
    displayName: "Teacher Demo",
  },
};

const MOCK_AUTH_KEY = "admitra.mock.auth";

export type MockSession = {
  userId: string;
  email: string;
  role: MockRole;
  displayName: string;
  loggedInAt: string;
};

export function isMockAuthEnabled(): boolean {
  // Mock auth is opt-in via NEXT_PUBLIC_ENABLE_MOCK_AUTH=true
  // Default to real Supabase auth
  return env.NEXT_PUBLIC_ENABLE_MOCK_AUTH === true;
}

export function listMockCredentials() {
  return Object.values(MOCK_ACCOUNTS).map((account) => ({
    role: account.role,
    username: account.email,
    password: account.password,
  }));
}

export function getMockSession(): MockSession | null {
  if (!isMockAuthEnabled() || typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(MOCK_AUTH_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as MockSession;
  } catch {
    return null;
  }
}

export function setMockSession(session: MockSession) {
  if (!isMockAuthEnabled() || typeof window === "undefined") return;
  window.localStorage.setItem(MOCK_AUTH_KEY, JSON.stringify(session));
}

export function clearMockSession() {
  if (!isMockAuthEnabled() || typeof window === "undefined") return;
  window.localStorage.removeItem(MOCK_AUTH_KEY);
}

export function signInWithMockCredentials(email: string, password: string): MockSession | null {
  if (!isMockAuthEnabled()) return null;
  const account = Object.values(MOCK_ACCOUNTS).find(
    (candidate) => candidate.email.toLowerCase() === email.toLowerCase() && candidate.password === password
  );
  if (!account) return null;
  const session: MockSession = {
    userId: account.id,
    email: account.email,
    role: account.role,
    displayName: account.displayName,
    loggedInAt: new Date().toISOString(),
  };
  setMockSession(session);
  return session;
}

