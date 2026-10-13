import * as React from "react";

import { Input } from "@/components/ui/input";
import { formatPhone, normalizePhoneDigits } from "@/lib/utils";

interface PhoneInputProps extends Omit<
  React.ComponentProps<"input">,
  "type" | "value" | "onChange"
> {
  value?: string;
  onChange?: (value: string) => void;
  countryCode?: string;
}

function PhoneInput({
  className,
  value,
  onChange,
  countryCode = "62",
  ref,
  ...props
}: PhoneInputProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [prevValue, setPrevValue] = React.useState(value);
  const [display, setDisplay] = React.useState(() =>
    formatPhone(String(value ?? ""), countryCode),
  );

  if (prevValue !== value) {
    const normalized = formatPhone(String(value ?? ""), countryCode);
    if (
      normalizePhoneDigits(display, countryCode) !==
      normalizePhoneDigits(normalized, countryCode)
    ) {
      setDisplay(normalized);
    }
    setPrevValue(value);
  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const rawValue = event.target.value;
    const cursor = event.target.selectionStart ?? rawValue.length;

    let digits = normalizePhoneDigits(rawValue, countryCode);
    const prevDigits = normalizePhoneDigits(display, countryCode);

    let digitsBeforeCursor = normalizePhoneDigits(
      rawValue.slice(0, cursor),
      countryCode,
    ).length;

    // If user hit backspace on a '-' delimiter, native input deletes the '-' but keeps all digits.
    // In that case, we also delete the digit immediately preceding the '-'!
    if (
      rawValue.length < display.length &&
      digits.length === prevDigits.length &&
      cursor > 0
    ) {
      const before = rawValue.slice(0, cursor - 1);
      const after = rawValue.slice(cursor);
      digits = normalizePhoneDigits(before + after, countryCode);
      digitsBeforeCursor = normalizePhoneDigits(before, countryCode).length;
    }

    const formatted = formatPhone(digits, countryCode);

    setDisplay(formatted);
    onChange?.(digits);

    requestAnimationFrame(() => {
      const el = inputRef.current;
      if (!el) return;

      let seen = 0;
      let nextCursor = formatted.length;
      for (let i = 0; i < formatted.length; i++) {
        if (formatted[i] !== "-") seen++;
        if (seen === digitsBeforeCursor) {
          nextCursor = i + 1;
          break;
        }
      }
      if (digitsBeforeCursor === 0) nextCursor = 0;

      el.setSelectionRange(nextCursor, nextCursor);
    });
  }

  return (
    <Input
      type="tel"
      inputMode="numeric"
      autoComplete="tel-national"
      {...props}
      ref={(node) => {
        inputRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      }}
      value={display}
      onChange={handleChange}
      className={className}
    />
  );
}

export { PhoneInput };
export type { PhoneInputProps };
