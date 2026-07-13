import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { type Ticket } from "core/constants/ticket.ts";
import { agentTicketStatuses, statusLabel } from "core/constants/ticket-status.ts";
import { ticketCategories, categoryLabel } from "core/constants/ticket-category.ts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Agent {
  id: string;
  name: string;
}

interface UpdateTicketProps {
  ticket: Ticket;
}

export default function UpdateTicket({ ticket }: UpdateTicketProps) {
  const queryClient = useQueryClient();

  const { data: agentsData } = useQuery({
    queryKey: ["agents"],
    queryFn: async () => {
      const { data } = await axios.get<{ agents: Agent[] }>("/api/agents");
      return data;
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (body: Record<string, unknown>) => {
      const { data } = await axios.patch(`/api/tickets/${ticket.id}`, body);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ticket", String(ticket.id)] });
    },
  });

  const sections = [
    {
      label: "Status",
      content: (
        <Select
          value={ticket.status}
          onValueChange={(value) => updateMutation.mutate({ status: value })}
        >
          <SelectTrigger size="sm" className="w-full bg-accent/30 border-border/40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {agentTicketStatuses.map((s) => (
              <SelectItem key={s} value={s}>
                {statusLabel[s]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ),
    },
    {
      label: "Category",
      content: (
        <Select
          value={ticket.category ?? "none"}
          onValueChange={(value) =>
            updateMutation.mutate({
              category: value === "none" ? null : value,
            })
          }
        >
          <SelectTrigger size="sm" className="w-full bg-accent/30 border-border/40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">None</SelectItem>
            {ticketCategories.map((c) => (
              <SelectItem key={c} value={c}>
                {categoryLabel[c]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ),
    },
    {
      label: "Assigned To",
      content: (
        <Select
          value={ticket.assignedTo?.id ?? "unassigned"}
          onValueChange={(value) =>
            updateMutation.mutate({
              assignedToId: value === "unassigned" ? null : value,
            })
          }
        >
          <SelectTrigger size="sm" className="w-full bg-accent/30 border-border/40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="unassigned">Unassigned</SelectItem>
            {agentsData?.agents.map((agent) => (
              <SelectItem key={agent.id} value={agent.id}>
                {agent.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ),
    },
  ];

  return (
    <div className="w-[240px] h-fit sticky top-8 rounded-xl border border-border/50 bg-card/60 p-4 space-y-5">
      <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-muted-foreground/60">
        Properties
      </p>
      {sections.map((section, i) => (
        <div key={section.label}>
          <div className="space-y-1.5">
            <span className="text-[11.5px] font-semibold uppercase tracking-widest text-muted-foreground">
              {section.label}
            </span>
            {section.content}
          </div>
          {i < sections.length - 1 && (
            <div className="h-px bg-border/30 mt-4" />
          )}
        </div>
      ))}
    </div>
  );
}
