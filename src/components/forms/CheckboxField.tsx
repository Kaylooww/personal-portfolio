import { useId, type ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils/cn";

interface CheckboxFieldProps extends Omit<ComponentPropsWithoutRef<"input">, "id" | "type"> {
  label: string;
  hint?: string;
}

export function CheckboxField({ label, hint, className, ...input }: CheckboxFieldProps) {
  const id = useId();
  const hintId = hint ? `${id}-hint` : undefined;
  return (
    <div className={cn("flex items-start gap-3", className)}>
      <input id={id} type="checkbox" aria-describedby={hintId} className="mt-0.5 size-5 shrink-0 accent-blue-500" {...input} />
      <div>
        <label htmlFor={id} className="font-extrabold text-navy-900">
          {label}
        </label>
        {hint && (
          <p id={hintId} className="text-sm text-navy-500">
            {hint}
          </p>
        )}
      </div>
    </div>
  );
}
