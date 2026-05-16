import { useTranslation } from 'react-i18next';

export interface DifficultyOption {
  value: string;
  labelKey: string;
  /** Glyph(s) shown before the label; omit for no icon (e.g. the "all" option). */
  icon?: string;
}

interface DifficultyFilterBarProps {
  value: string;
  onChange: (value: string) => void;
  /** The page supplies its own scale (emoji dots vs. stars) and label keys. */
  options: DifficultyOption[];
  /** Class for the icon span — `diff-icon` (Theory) or `diff-stars` (Problems). */
  iconClassName: string;
}

/**
 * The difficulty pill row. Markup/behaviour is shared; the icon scale and
 * label keys differ per page, so they come in as `options`/`iconClassName`.
 */
export default function DifficultyFilterBar({
  value,
  onChange,
  options,
  iconClassName
}: DifficultyFilterBarProps) {
  const { t } = useTranslation();
  return (
    <div className="filter-bar difficulty-filter">
      {options.map(o => (
        <button
          key={o.value}
          className={`filter-btn diff-filter-btn ${value === o.value ? 'active' : ''}`}
          onClick={() => onChange(o.value)}
        >
          {o.icon && <span className={iconClassName}>{o.icon}</span>}{' '}
          {t(o.labelKey)}
        </button>
      ))}
    </div>
  );
}
