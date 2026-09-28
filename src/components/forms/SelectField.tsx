import { useId, type ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils/cn";

interface SelectFieldProps extends Omit<ComponentPropsWithoutRef<"select">, "id"> {
  label: string;
  options: readonly { value: string; label: string }[];
  error?: string | null;
}

export function SelectField({ label, options, error, className, ...select }: SelectFieldProps) {
  const id = useId();
  const errorId = error ? `${id}-error` : undefined;
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={id} className="text-sm font-extrabold text-navy-900">
        {label}
      </label>
      <select
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={errorId}
        className={cn(
          "h-12 rounded-control border bg-white px-3 text-base text-navy-900",
          error ? "border-danger-600" : "border-paper-edge hover:border-wood-300",
        )}
        {...select}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {error && (
        <p id={errorId} className="text-sm font-bold text-danger-600">
          {error}
        </p>
      )}
    </div>
  );
}
