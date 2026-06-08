import type { User } from "../types";

export const DEMO_USER: User = {
  id: "user-demo",
  email: "demo@example.com",
  password: "password123",
  name: "Alex Thompson",
  createdAt: "2025-01-15T10:00:00Z",
};

export const SEED_USERS: User[] = [DEMO_USER];
