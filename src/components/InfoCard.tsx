"use client";

import type { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

type InfoCardProps = {
  title: string;
  value: string | number | null;
  icon: ReactNode;
  description?: string;
  isLoading?: boolean;
};

export function InfoCard({ title, value, icon, description, isLoading = false }: InfoCardProps) {
  return (
    <Card className="shadow-lg transition-transform hover:scale-[1.03]">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className="text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-8 w-1/2" />
        ) : (
          <div className="text-2xl font-bold text-primary">
            {value}
          </div>
        )}
        {description && <p className="text-xs text-muted-foreground pt-1">{description}</p>}
      </CardContent>
    </Card>
  );
}
