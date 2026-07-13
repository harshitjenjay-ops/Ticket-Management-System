import DOMPurify from "dompurify";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { type Ticket } from "core/constants/ticket.ts";
import { type SenderType, senderTypeLabel } from "core/constants/sender-type.ts";
import { Skeleton } from "@/components/ui/skeleton";
import ErrorAlert from "@/components/ErrorAlert";
import { Bot, User } from "lucide-react";

interface Reply {
  id: number;
  body: string;
  bodyHtml: string | null;
  senderType: SenderType;
  user: { id: string; name: string } | null;
  createdAt: string;
}

interface ReplyThreadProps {
  ticket: Ticket;
}

export default function ReplyThread({ ticket }: ReplyThreadProps) {
  const { id: ticketId, senderName } = ticket;
  const { data, isLoading, error } = useQuery({
    queryKey: ["replies", ticketId],
    queryFn: async () => {
      const { data } = await axios.get<{ replies: Reply[] }>(
        `/api/tickets/${ticketId}/replies`
      );
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-24 w-full shimmer rounded-xl" />
        <Skeleton className="h-24 w-full shimmer rounded-xl" />
      </div>
    );
  }

  if (error) {
    return <ErrorAlert message="Failed to load replies" />;
  }

  if (!data?.replies.length) {
    return (
      <div className="text-center py-8 text-sm text-muted-foreground rounded-xl border border-dashed border-border/50">
        No replies yet
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {data.replies.map((reply) => {
        const isAgent = reply.senderType === "agent";
        const displayName = isAgent
          ? reply.user?.name ?? "Agent"
          : senderName;
        const initials = displayName
          .split(" ")
          .map((w: string) => w[0])
          .join("")
          .toUpperCase()
          .slice(0, 2);

        return (
          <div
            key={reply.id}
            className={`rounded-xl border p-4 transition-colors duration-150 ${
              isAgent
                ? "border-primary/20 bg-primary/[0.04]"
                : "border-border/40 bg-card/50"
            }`}
          >
            <div className="flex items-center gap-3 mb-3">
              <div
                className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${
                  isAgent
                    ? "bg-primary/15 text-primary"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {isAgent ? (
                  <Bot className="h-4 w-4" />
                ) : (
                  <span className="text-[10px] font-bold">{initials}</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold">{displayName}</p>
                <p className="text-[11px] text-muted-foreground">
                  {senderTypeLabel[reply.senderType]} · {new Date(reply.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
            <div className="pl-11">
              {reply.bodyHtml ? (
                <div
                  className="prose prose-sm max-w-none dark:prose-invert text-[13.5px]"
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(reply.bodyHtml),
                  }}
                />
              ) : (
                <p className="whitespace-pre-line leading-relaxed text-[13.5px]">
                  {reply.body}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
