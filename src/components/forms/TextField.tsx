import { useId, type ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils/cn";

interface TextFieldProps extends Omit<ComponentPropsWithoutRef<"input">, "id"> {
  label: string;
  hint?: string;
  error?: string | null;
}

/** Labelled input with hint and error text wired up for screen readers. */
export function TextField({ label, hint, error, className, ...input }: TextFieldProps) {
  const id = useId();
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={id} className="text-sm font-extrabold text-navy-900">
        {label}
      </label>
      <input
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={[hintId, errorId].filter(Boolean).join(" ") || undefined}
        className={cn(
          "h-12 rounded-control border bg-white px-3.5 text-base text-navy-900 placeholder:text-navy-300",
          "transition-trail transition-colors",
          error ? "border-danger-600" : "border-paper-edge hover:border-wood-300",
        )}
        {...input}
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
