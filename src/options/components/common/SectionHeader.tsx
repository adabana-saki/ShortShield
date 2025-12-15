/**
 * Section header component for settings pages
 */

import type { ReactNode } from 'react';

interface SectionHeaderProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
}

export function SectionHeader({
  title,
  description,
  icon,
  action,
}: SectionHeaderProps) {
  return (
    <div className="section-header">
      <div className="section-header-left">
        {icon && <span className="section-header-icon">{icon}</span>}
        <div className="section-header-text">
          <h2 className="section-header-title">{title}</h2>
          {description && (
            <p className="section-header-description">{description}</p>
          )}
        </div>
      </div>
      {action && <div className="section-header-action">{action}</div>}
    </div>
  );
}
