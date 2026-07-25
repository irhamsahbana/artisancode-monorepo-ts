import { Star } from "lucide-react";

interface Props {
  value: number;
  onChange: (value: number) => void;
  max?: number;
  disabled?: boolean;
}

// ponytail: click left/right half of each star to set .5 steps, no drag.
export function StarRating({ value, onChange, max = 5, disabled }: Props) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: max }, (_, i) => i + 1).map((n) => (
        <StarButton
          key={n}
          index={n}
          value={value}
          onChange={onChange}
          disabled={disabled}
        />
      ))}
      <span className="ml-1 text-sm text-muted-foreground">
        {value > 0 ? value.toFixed(1) : "-"}
      </span>
    </div>
  );
}

function StarButton({
  index,
  value,
  onChange,
  disabled,
}: {
  index: number;
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}) {
  const fillPercent = value >= index ? 100 : value >= index - 0.5 ? 50 : 0;

  function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const isLeftHalf = e.clientX - rect.left < rect.width / 2;
    onChange(isLeftHalf ? index - 0.5 : index);
  }

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={handleClick}
      className="relative h-5 w-5 disabled:cursor-not-allowed"
    >
      <Star className="absolute inset-0 h-5 w-5 text-muted-foreground" />
      {fillPercent > 0 && (
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ width: `${fillPercent}%` }}
        >
          <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
        </div>
      )}
    </button>
  );
}
