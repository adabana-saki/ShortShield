/**
 * Collapsible section component for sidebar and settings
 */

import type { ReactNode } from 'react';

interface CollapsibleSectionProps {
  title: string;
  icon?: ReactNode;
  expanded: boolean;
  onToggle: () => void;
  children: ReactNode;
  active?: boolean;
  className?: string;
}

export function CollapsibleSection({
  title,
  icon,
  expanded,
  onToggle,
  children,
  active = false,
  className = '',
}: CollapsibleSectionProps) {
  return (
    <div
      className={`collapsible-section ${className} ${active ? 'collapsible-section-active' : ''}`}
    >
      <button
        type="button"
        className={`collapsible-header ${expanded ? 'collapsible-header-expanded' : ''}`}
        onClick={onToggle}
        aria-expanded={expanded}
      >
        {icon && <span className="collapsible-icon">{icon}</span>}
        <span className="collapsible-title">{title}</span>
        <span className={`collapsible-chevron ${expanded ? 'expanded' : ''}`}>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polyline points="6,9 12,15 18,9" />
          </svg>
        </span>
      </button>

      <div
        className={`collapsible-content ${expanded ? 'collapsible-content-expanded' : ''}`}
        aria-hidden={!expanded}
      >
        {children}
      </div>
    </div>
  );
}
