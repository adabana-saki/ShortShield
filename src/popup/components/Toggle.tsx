/**
 * Main toggle component for enabling/disabling blocking
 */

import { useI18n } from '@/shared/hooks/useI18n';

interface ToggleProps {
  enabled: boolean;
  onToggle: () => void;
  disabled?: boolean;
}

export function Toggle({ enabled, onToggle, disabled = false }: ToggleProps) {
  const { t } = useI18n();

  return (
    <div className="toggle-container">
      <div className="toggle-wrapper">
        <div>
          <span className="toggle-label">
            {enabled ? t('popupStatusEnabled') : t('popupStatusDisabled')}
          </span>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={enabled}
          disabled={disabled}
          onClick={onToggle}
          className={`toggle-switch ${enabled ? 'toggle-switch-enabled' : 'toggle-switch-disabled'} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <span
            aria-hidden="true"
            className={`toggle-knob ${enabled ? 'toggle-knob-enabled' : 'toggle-knob-disabled'}`}
          />
        </button>
      </div>
    </div>
  );
}
