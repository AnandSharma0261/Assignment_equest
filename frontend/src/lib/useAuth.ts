'use client';

import { useEffect, useState } from 'react';
import { api, ApiError } from './api';
import type { User } from './types';

type State = { user: User | null; loading: boolean };

export function useAuth(): State & { refresh: () => Promise<void> } {
  const [state, setState] = useState<State>({ user: null, loading: true });

  async function refresh() {
    try {
      const { user } = await api.me();
      setState({ user, loading: false });
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        setState({ user: null, loading: false });
        return;
      }
      setState({ user: null, loading: false });
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  return { ...state, refresh };
}
