import { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
}

export function PageHeader({ title, description, actions, className = "" }: PageHeaderProps) {
  return (
    <div className={`flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between ${className}`}>
      <div>
        <h1 className="text-xl md:text-2xl font-semibold text-foreground tracking-tight">
          {title}
        </h1>
        {description && (
          <p className="text-sm md:text-base text-muted-foreground mt-1">
            {description}
          </p>
        )}
      </div>
      {actions && <div className="flex gap-2">{actions}</div>}
    </div>
  );
}
