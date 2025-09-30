"use client";

import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

interface OrderStatusTriggerProps {
  onClick: () => void;
}

export function OrderStatusTrigger({ onClick }: OrderStatusTriggerProps) {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button
        onClick={onClick}
        size="lg"
        className="h-14 px-6 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200 animate-pulse-glow"
      >
        <Search className="w-5 h-5 mr-2" />
        <span className="font-medium">Check Order</span>
      </Button>
    </div>
  );
}
