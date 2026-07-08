import { create } from 'zustand';

import type { AuthUser } from '@/shared/types/api/auth';

interface AuthStore {
  userInfo: AuthUser | null;
  setUserInfo: (userInfo: AuthUser | null) => void;
}

export const useAuthStore = create<AuthStore>(set => ({
  userInfo: null,
  setUserInfo: userInfo => set({ userInfo }),
}));
