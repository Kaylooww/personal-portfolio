import { useId, type ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils/cn";

interface TextAreaFieldProps extends Omit<ComponentPropsWithoutRef<"textarea">, "id"> {
  label: string;
  hint?: string;
  error?: string | null;
}

export function TextAreaField({ label, hint, error, className, rows = 4, ...textarea }: TextAreaFieldProps) {
  const id = useId();
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={id} className="text-sm font-extrabold text-navy-900">
        {label}
      </label>
      <textarea
        id={id}
        rows={rows}
        aria-invalid={error ? true : undefined}
        aria-describedby={[hintId, errorId].filter(Boolean).join(" ") || undefined}
        className={cn(
          "rounded-control border bg-white px-3.5 py-2.5 text-base leading-relaxed text-navy-900 placeholder:text-navy-300",
          error ? "border-danger-600" : "border-paper-edge hover:border-wood-300",
        )}
        {...textarea}
      />
      {hint && (
        <p id={hintId} className="text-sm text-navy-500">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="text-sm font-bold text-danger-600">
          {error}
        </p>
      )}
    </div>
  );
}
