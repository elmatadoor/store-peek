import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const statusBadgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      status: {
        pending: "bg-pending text-pending-foreground",
        processing: "bg-processing text-processing-foreground",
        "on-hold": "bg-warning text-warning-foreground",
        completed: "bg-success text-success-foreground",
        cancelled: "bg-destructive text-destructive-foreground",
        refunded: "bg-muted text-muted-foreground",
        failed: "bg-destructive text-destructive-foreground",
      },
    },
    defaultVariants: {
      status: "pending",
    },
  }
);

export interface StatusBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof statusBadgeVariants> {}

function StatusBadge({ className, status, children, ...props }: StatusBadgeProps) {
  return (
    <div className={cn(statusBadgeVariants({ status }), className)} {...props}>
      {children}
    </div>
  );
}

export { StatusBadge, statusBadgeVariants };