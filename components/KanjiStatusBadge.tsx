import React from "react";
import { Badge } from "./ui/badge";
import { KanjiLevel } from "@prisma/client";

interface Props {
  status: KanjiLevel;
}

const statusMap: Record<
  KanjiLevel,
  {
    label: string;
    color: "bg-green-400" | "bg-yellow-400" | "bg-orange-400" | "bg-red-400";
  }
> = {
  NEW: { label: "New", color: "bg-green-400" },
  LEARNING: { label: "Learning", color: "bg-yellow-400" },
  MASTERED: { label: "Mastered", color: "bg-orange-400" },
  INGRAINED: { label: "Ingrained", color: "bg-red-400" },
};

const TicketStatusBadge = ({ status }: Props) => {
  return (
    <div>
      <Badge
        className={`${statusMap[status].color} text-background pb-1 hover:${statusMap[status].color}`}
      >
        {statusMap[status].label}
      </Badge>
    </div>
  );
};

export default TicketStatusBadge;
