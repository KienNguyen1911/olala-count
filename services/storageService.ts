import { Event, User, Note } from '../types';

const KEYS = {
  EVENTS: 'neo_events',
  USER: 'neo_user',
  PUSH: 'neo_push',
};

// Initial Mock Data
const MOCK_EVENTS: Event[] = [
  {
    id: '1',
    name: 'Tokyo Trip',
    targetDate: new Date(Date.now() + 86400000 * 15).toISOString(),
    description: 'Planning the big move.',
    category: 'trip',
    themeColor: '#B8FF9F',
    notes: [
      { id: 'n1', content: 'Buy JR Pass', isCompleted: false },
      { id: 'n2', content: 'Book Hotel in Shinjuku', isCompleted: true }
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Project Launch',
    targetDate: new Date(Date.now() + 86400000 * 3).toISOString(),
    description: 'Neobrutalism UI Release',
    category: 'work',
    themeColor: '#FF9F9F',
    notes: [],
    createdAt: new Date().toISOString(),
  }
];

export const getStoredUser = (): User | null => {
  const stored = localStorage.getItem(KEYS.USER);
  return stored ? JSON.parse(stored) : null;
};

export const loginMock = (email: string): User => {
  const user = { id: 'u1', name: email.split('@')[0], email };
  localStorage.setItem(KEYS.USER, JSON.stringify(user));
  return user;
};

export const logoutMock = () => {
  localStorage.removeItem(KEYS.USER);
};

export const getEvents = (): Event[] => {
  const stored = localStorage.getItem(KEYS.EVENTS);
  if (!stored) {
    localStorage.setItem(KEYS.EVENTS, JSON.stringify(MOCK_EVENTS));
    return MOCK_EVENTS;
  }
  return JSON.parse(stored);
};

export const saveEvent = (event: Event): Event[] => {
  const events = getEvents();
  const index = events.findIndex(e => e.id === event.id);
  let newEvents;
  if (index >= 0) {
    newEvents = [...events];
    newEvents[index] = event;
  } else {
    newEvents = [event, ...events];
  }
  localStorage.setItem(KEYS.EVENTS, JSON.stringify(newEvents));
  return newEvents;
};

export const deleteEvent = (id: string): Event[] => {
  const events = getEvents().filter(e => e.id !== id);
  localStorage.setItem(KEYS.EVENTS, JSON.stringify(events));
  return events;
};

export const getPushStatus = (): boolean => {
  return localStorage.getItem(KEYS.PUSH) === 'true';
};

export const togglePushStatus = (): boolean => {
  const current = getPushStatus();
  localStorage.setItem(KEYS.PUSH, String(!current));
  return !current;
};