/**
 * Settings page layout component with sidebar and main content area
 */

import type { ReactNode } from 'react';
import { Sidebar, type SectionId, type SubSectionId } from './Sidebar';

interface SettingsLayoutProps {
  activeSection: SectionId;
  activeSubSection: SubSectionId | null;
  onSectionChange: (section: SectionId, subSection?: SubSectionId) => void;
  advancedExpanded: boolean;
  onAdvancedToggle: () => void;
  children: ReactNode;
}

export function SettingsLayout({
  activeSection,
  activeSubSection,
  onSectionChange,
  advancedExpanded,
  onAdvancedToggle,
  children,
}: SettingsLayoutProps) {
  return (
    <div className="settings-layout">
      <Sidebar
        activeSection={activeSection}
        activeSubSection={activeSubSection}
        onSectionChange={onSectionChange}
        advancedExpanded={advancedExpanded}
        onAdvancedToggle={onAdvancedToggle}
      />
      <main className="settings-main">{children}</main>
    </div>
  );
}
