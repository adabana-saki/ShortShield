/**
 * Status card component showing key metrics
 */

import type { ReactNode } from 'react';

interface StatusCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  subtitle?: string;
  variant?: 'default' | 'success' | 'warning' | 'accent';
}

export function StatusCard({
  title,
  value,
  icon,
  subtitle,
  variant = 'default',
}: StatusCardProps) {
  return (
    <div className={`status-card status-card-${variant}`}>
      <div className="status-card-icon">{icon}</div>
      <div className="status-card-content">
        <span className="status-card-value">{value}</span>
        <span className="status-card-title">{title}</span>
        {subtitle && <span className="status-card-subtitle">{subtitle}</span>}
      </div>
    </div>
  );
}
