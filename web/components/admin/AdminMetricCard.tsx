import { ReactNode } from 'react';
import styles from '@/app/admin/page.module.css';

interface AdminMetricCardProps {
  title: string;
  value: string | number;
  trend?: string;
  icon: ReactNode;
}

export function AdminMetricCard({ title, value, trend, icon }: AdminMetricCardProps) {
  return (
    <div className={styles.statCard}>
      <div className={styles.statHeader}>
        <h3>{title}</h3>
        <div className={styles.statIcon}>{icon}</div>
      </div>
      <p className={styles.statValue}>{value}</p>
      {trend && <p className={styles.statTrend}>{trend}</p>}
    </div>
  );
}
