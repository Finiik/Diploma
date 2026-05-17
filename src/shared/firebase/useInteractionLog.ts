import { useCallback } from 'react';
import { useAuth } from '@/shared/auth/AuthContext';
import { isFirebaseConfigured } from '@/shared/lib/env';

type InteractionType = 'view' | 'calculation' | 'bookmark';

async function safeLogInteraction(
  userId: string,
  formulaId: string,
  type: InteractionType
) {
  try {
    const { logInteraction } = await import('@/shared/firebase/firestore');
    await logInteraction(userId, formulaId, type);
  } catch (e) {
    console.warn('Failed to log interaction:', e);
  }
}

/**
 * Fire-and-forget interaction logging. Encapsulates the
 * `isFirebaseConfigured` guard, the signed-in-user lookup, the dynamic
 * firestore import and error swallowing so pages don't orchestrate it.
 */
export function useInteractionLog() {
  const { user } = useAuth();
  const uid = user?.uid;

  const log = useCallback(
    (formulaId: string, type: InteractionType) => {
      if (!isFirebaseConfigured() || !uid) return;
      void safeLogInteraction(uid, formulaId, type);
    },
    [uid]
  );

  return {
    logView: useCallback((id: string) => log(id, 'view'), [log]),
    logCalculation: useCallback((id: string) => log(id, 'calculation'), [log])
  };
}
