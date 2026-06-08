import type { Conversation, Message } from "../types";

export const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: "conv-1",
    participantId: "user-1",
    participantName: "Priya Sharma",
    participantPhoto: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    lastMessage: "That sounds lovely! Would love to chat more.",
    lastMessageAt: "2025-06-07T14:30:00Z",
    unreadCount: 2,
  },
  {
    id: "conv-2",
    participantId: "user-2",
    participantName: "James Wilson",
    participantPhoto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    lastMessage: "Thanks for connecting! How's your week going?",
    lastMessageAt: "2025-06-06T09:15:00Z",
    unreadCount: 0,
  },
  {
    id: "conv-3",
    participantId: "user-5",
    participantName: "Emily Clarke",
    participantPhoto: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop",
    lastMessage: "I noticed we both love travelling!",
    lastMessageAt: "2025-06-05T18:45:00Z",
    unreadCount: 1,
  },
];

export const MOCK_MESSAGES: Record<string, Message[]> = {
  "conv-1": [
    {
      id: "msg-1",
      fromUserId: "user-1",
      toUserId: "user-demo",
      content: "Hi! I saw your profile and thought we might have a lot in common.",
      timestamp: "2025-06-07T12:00:00Z",
      read: true,
    },
    {
      id: "msg-2",
      fromUserId: "user-demo",
      toUserId: "user-1",
      content: "Hello Priya! Thank you for reaching out. I'd love to know more about you.",
      timestamp: "2025-06-07T12:30:00Z",
      read: true,
    },
    {
      id: "msg-3",
      fromUserId: "user-1",
      toUserId: "user-demo",
      content: "That sounds lovely! Would love to chat more.",
      timestamp: "2025-06-07T14:30:00Z",
      read: false,
    },
  ],
  "conv-2": [
    {
      id: "msg-4",
      fromUserId: "user-demo",
      toUserId: "user-2",
      content: "Hi James, great to connect with you!",
      timestamp: "2025-06-06T08:00:00Z",
      read: true,
    },
    {
      id: "msg-5",
      fromUserId: "user-2",
      toUserId: "user-demo",
      content: "Thanks for connecting! How's your week going?",
      timestamp: "2025-06-06T09:15:00Z",
      read: true,
    },
  ],
  "conv-3": [
    {
      id: "msg-6",
      fromUserId: "user-5",
      toUserId: "user-demo",
      content: "I noticed we both love travelling!",
      timestamp: "2025-06-05T18:45:00Z",
      read: false,
    },
  ],
};
