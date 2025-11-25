export interface Note {
  id: string;
  content: string;
  isCompleted: boolean;
}

export interface Event {
  id: string;
  name: string;
  targetDate: string; // ISO String
  description: string;
  category: 'personal' | 'work' | 'trip' | 'other';
  themeColor: string;
  notes: Note[];
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

// Simulated Push Subscription for UI purposes
export interface PushSubscriptionMock {
  enabled: boolean;
}