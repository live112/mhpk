import React from "react";
import { Card, CardBody } from "@heroui/react";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
}

export const GlassCard = ({
  children,
  className = "",
  ...props
}: GlassCardProps) => {
  return (
    <Card
      className={`
        backdrop-blur-md bg-white/10 dark:bg-black/10 
        border border-white/20 dark:border-white/10
        shadow-xl shadow-black/5 dark:shadow-black/20
        hover:bg-white/15 dark:hover:bg-black/15
        hover:border-white/30 dark:hover:border-white/20
        transition-all duration-300 ease-in-out
        hover:scale-[1.02] hover:shadow-2xl
        ${className}
      `}
      {...props}
    >
      <CardBody className="p-6">{children}</CardBody>
    </Card>
  );
};
