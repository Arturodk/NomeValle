'use client';

import { useState, useTransition } from 'react';
import { updateOrderStatus } from '../actions';

interface Props {
  orderId: string;
  currentStatus: string;
}

export function OrderStatusSelector({ orderId, currentStatus }: Props) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const validTransitions: Record<string, string[]> = {
    'pendiente': ['pagado', 'cancelado'],
    'pagado': ['enviado', 'cancelado'],
    'enviado': ['entregado', 'cancelado'],
    'entregado': [],
    'cancelado': []
  };

  const allowedOptions = validTransitions[currentStatus] || [];

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    if (!newStatus || newStatus === currentStatus) return;

    setError(null);
    startTransition(async () => {
      const result = await updateOrderStatus(orderId, newStatus);
      if (!result.success) {
        setError(result.error || 'Error al actualizar el estado');
      }
    });
  };

  return (
    <div>
      <select 
        value={currentStatus} 
        onChange={handleStatusChange}
        disabled={isPending || allowedOptions.length === 0}
        style={{ padding: '8px 12px', borderRadius: '4px', border: '1px solid #d1d5db', background: 'white' }}
      >
        <option value={currentStatus}>{currentStatus}</option>
        {allowedOptions.map(option => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
      {isPending && <span style={{ marginLeft: '8px', fontSize: '12px', color: '#6b7280' }}>Actualizando...</span>}
      {error && <p style={{ color: '#991b1b', fontSize: '12px', marginTop: '4px' }}>{error}</p>}
    </div>
  );
}
