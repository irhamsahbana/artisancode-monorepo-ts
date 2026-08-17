import { COUNTRY_CODES } from "@artisancode/phone";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function CountryCodeSelect({
  value,
  onValueChange,
}: {
  value: string;
  onValueChange: (value: string) => void;
}) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-24 shrink-0">
        <SelectValue placeholder="+62" />
      </SelectTrigger>
      <SelectContent>
        {COUNTRY_CODES.map((c) => (
          <SelectItem key={c.code} value={c.code}>
            +{c.code}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
