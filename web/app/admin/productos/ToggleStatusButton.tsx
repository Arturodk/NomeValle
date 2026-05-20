'use client';

import { useTransition } from 'react';
import { toggleProductStatus } from './actions';

export function ToggleStatusButton({ id, isActive }: { id: string, isActive: boolean | null }) {
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    startTransition(async () => {
      await toggleProductStatus(id, isActive);
    });
  };

  return (
    <button 
      onClick={handleToggle}
      disabled={isPending}
      style={{
        padding: '6px 12px',
        borderRadius: '4px',
        border: '1px solid #d1d5db',
        background: 'white',
        cursor: isPending ? 'not-allowed' : 'pointer',
        opacity: isPending ? 0.7 : 1,
        fontSize: '13px'
      }}
    >
      {isPending ? 'Cambiando...' : (isActive ? 'Archivar' : 'Reactivar')}
    </button>
  );
}
