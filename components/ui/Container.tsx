import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {}

export default function Container({ className, children, ...props }: ContainerProps) {
  return (
    <div className={cn("container-site", className)} {...props}>
      {children}
    </div>
  );
}
