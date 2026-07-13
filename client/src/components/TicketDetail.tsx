import DOMPurify from "dompurify";
import { type Ticket } from "core/constants/ticket.ts";
import { Card, CardContent } from "@/components/ui/card";
import StatusBadge from "@/components/StatusBadge";
import { Mail, Calendar, RefreshCw } from "lucide-react";

interface TicketDetailProps {
  ticket: Ticket;
}

export default function TicketDetail({ ticket }: TicketDetailProps) {
  return (
    <>
      <div>
        <div className="flex items-start gap-3 mb-4">
          <h1 className="text-2xl font-bold tracking-tight flex-1">
            {ticket.subject}
          </h1>
          <StatusBadge status={ticket.status} />
        </div>
        <div className="flex flex-wrap gap-3">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-accent/50 text-[12.5px]">
            <Mail className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="font-medium">{ticket.senderName}</span>
            <span className="text-muted-foreground">({ticket.senderEmail})</span>
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-accent/50 text-[12.5px] text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            {new Date(ticket.createdAt).toLocaleString()}
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-accent/50 text-[12.5px] text-muted-foreground">
            <RefreshCw className="h-3.5 w-3.5" />
            {new Date(ticket.updatedAt).toLocaleString()}
          </span>
        </div>
      </div>

      <Card className="border-border/50 bg-card/60">
        <CardContent className="pt-6">
          {ticket.bodyHtml ? (
            <div
              className="prose prose-sm max-w-none dark:prose-invert"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(ticket.bodyHtml),
              }}
            />
          ) : (
            <p className="whitespace-pre-wrap leading-relaxed text-[14px]">
              {ticket.body}
            </p>
          )}
        </CardContent>
      </Card>
    </>
  );
}
