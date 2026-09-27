import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils/cn";

export function Container({ className, ...rest }: ComponentPropsWithoutRef<"div">) {
  return <div className={cn("mx-auto w-full max-w-(--content-max) px-(--page-gutter)", className)} {...rest} />;
}
