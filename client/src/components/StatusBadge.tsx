import { type TicketStatus, statusLabel } from "core/constants/ticket-status.ts";

const statusStyles: Record<TicketStatus, string> = {
  new: "bg-sky-500/12 text-sky-400 border-sky-500/20",
  processing: "bg-amber-500/12 text-amber-400 border-amber-500/20",
  open: "bg-rose-400/12 text-rose-400 border-rose-400/20",
  resolved: "bg-emerald-500/12 text-emerald-400 border-emerald-500/20",
  closed: "bg-muted text-muted-foreground border-border/40",
};

const dotColors: Record<TicketStatus, string> = {
  new: "bg-sky-400",
  processing: "bg-amber-400",
  open: "bg-rose-400",
  resolved: "bg-emerald-400",
  closed: "bg-muted-foreground/50",
};

export default function StatusBadge({ status }: { status: TicketStatus }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11.5px] font-semibold ${statusStyles[status]}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${dotColors[status]}`} />
      {statusLabel[status]}
    </span>
  );
}
