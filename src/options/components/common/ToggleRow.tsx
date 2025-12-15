/**
 * Toggle row component for settings
 */

interface ToggleRowProps {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

export function ToggleRow({
  label,
  description,
  checked,
  onChange,
  disabled = false,
}: ToggleRowProps) {
  return (
    <div className={`toggle-row ${disabled ? 'toggle-row-disabled' : ''}`}>
      <div className="toggle-row-info">
        <span className="toggle-row-label">{label}</span>
        {description && (
          <span className="toggle-row-description">{description}</span>
        )}
      </div>
      <label className="toggle-switch">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
        />
        <span className="toggle-slider" />
      </label>
    </div>
  );
}
