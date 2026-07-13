import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Sparkles } from "lucide-react";
import { type Ticket } from "core/constants/ticket.ts";
import { Button } from "@/components/ui/button";
import ErrorAlert from "@/components/ErrorAlert";

interface TicketSummaryProps {
  ticket: Ticket;
}

export default function TicketSummary({ ticket }: TicketSummaryProps) {
  const summarizeMutation = useMutation({
    mutationFn: async () => {
      const { data } = await axios.post(
        `/api/tickets/${ticket.id}/replies/summarize`
      );
      return data.summary as string;
    },
  });

  return (
    <div className="space-y-3">
      <Button
        variant="outline"
        onClick={() => summarizeMutation.mutate()}
        disabled={summarizeMutation.isPending}
        className="gap-2 border-chart-3/25 text-chart-3 hover:bg-chart-3/10 hover:text-chart-3"
      >
        <Sparkles className="h-4 w-4" />
        {summarizeMutation.isPending ? "Summarizing..." : "AI Summarize"}
      </Button>

      {summarizeMutation.error && (
        <ErrorAlert
          error={summarizeMutation.error}
          fallback="Failed to generate summary"
        />
      )}

      {summarizeMutation.data && (
        <div className="rounded-xl border border-chart-3/20 bg-chart-3/[0.04] p-4">
          <div className="flex items-start gap-3">
            <div className="h-8 w-8 rounded-lg bg-chart-3/15 flex items-center justify-center shrink-0 mt-0.5">
              <Sparkles className="h-4 w-4 text-chart-3" />
            </div>
            <div>
              <p className="text-[11.5px] font-semibold uppercase tracking-widest text-chart-3 mb-1.5">
                AI Summary
              </p>
              <p className="whitespace-pre-wrap text-[13.5px] leading-relaxed">
                {summarizeMutation.data}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
