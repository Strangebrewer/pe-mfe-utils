import { create } from 'zustand';

type User = {
  id: string;
  email: string;
};

export interface UserStore {
  user: User | null;
  isReady: boolean;
  setUser: (user: User) => void;
  clearUser: () => void;
  setIsReady: (ready: boolean) => void;
}

export const useUserStore = create<UserStore>((set, get) => ({
  user: null,
  isReady: false,
  setUser: (user: User) => set({ user }),
  clearUser: () => set({ user: null }),
  setIsReady: (isReady) => set({ isReady }),
}));
