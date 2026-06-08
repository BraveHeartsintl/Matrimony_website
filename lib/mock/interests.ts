import type { Interest } from "../types";

export const MOCK_INTERESTS: Interest[] = [
  {
    id: "int-1",
    fromUserId: "user-1",
    toUserId: "user-demo",
    toUserName: "Priya Sharma",
    toUserPhoto: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    status: "pending",
    createdAt: "2025-06-07T10:00:00Z",
  },
  {
    id: "int-2",
    fromUserId: "user-demo",
    toUserId: "user-3",
    toUserName: "Fatima Khan",
    toUserPhoto: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    status: "accepted",
    createdAt: "2025-06-05T15:30:00Z",
  },
  {
    id: "int-3",
    fromUserId: "user-demo",
    toUserId: "user-6",
    toUserName: "Amandeep Singh",
    toUserPhoto: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
    status: "pending",
    createdAt: "2025-06-04T11:20:00Z",
  },
];
