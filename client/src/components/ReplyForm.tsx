import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { type Ticket } from "core/constants/ticket.ts";
import { createReplySchema, type CreateReplyInput } from "core/schemas/replies.ts";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import ErrorAlert from "@/components/ErrorAlert";
import ErrorMessage from "@/components/ErrorMessage";
import { Send, Sparkles } from "lucide-react";

interface ReplyFormProps {
  ticket: Ticket;
}

export default function ReplyForm({ ticket }: ReplyFormProps) {
  const ticketId = ticket.id;
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateReplyInput>({
    resolver: zodResolver(createReplySchema),
  });

  const bodyValue = watch("body");

  const replyMutation = useMutation({
    mutationFn: async (data: CreateReplyInput) => {
      const { data: reply } = await axios.post(
        `/api/tickets/${ticketId}/replies`,
        data
      );
      return reply;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["replies", ticketId] });
      reset();
    },
  });

  const polishMutation = useMutation({
    mutationFn: async () => {
      const { data } = await axios.post(`/api/tickets/${ticketId}/replies/polish`, {
        body: getValues("body"),
      });
      return data.body as string;
    },
    onSuccess: (polishedText) => {
      setValue("body", polishedText, { shouldValidate: true });
    },
  });

  return (
    <form onSubmit={handleSubmit((data) => replyMutation.mutate(data))} className="space-y-3">
      {replyMutation.error && (
        <ErrorAlert error={replyMutation.error} fallback="Failed to send reply" />
      )}
      {polishMutation.error && (
        <ErrorAlert error={polishMutation.error} fallback="Failed to polish reply" />
      )}

      <div className="space-y-1">
        <Textarea
          placeholder="Type your reply..."
          {...register("body")}
          rows={4}
          className="bg-accent/30 border-border/40 focus-glow transition-all duration-200 resize-none"
        />
        {errors.body && <ErrorMessage message={errors.body.message} />}
      </div>

      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          disabled={!bodyValue?.trim() || polishMutation.isPending || replyMutation.isPending}
          onClick={() => polishMutation.mutate()}
          className="gap-2 border-primary/20 text-primary hover:bg-primary/10 hover:text-primary"
        >
          <Sparkles className="h-3.5 w-3.5" />
          {polishMutation.isPending ? "Polishing..." : "Polish with AI"}
        </Button>
        <Button
          type="submit"
          disabled={!bodyValue?.trim() || replyMutation.isPending || polishMutation.isPending}
          className="gap-2 bg-gradient-to-r from-primary to-primary/85 shadow-lg shadow-primary/15"
        >
          <Send className="h-3.5 w-3.5" />
          {replyMutation.isPending ? "Sending..." : "Send Reply"}
        </Button>
      </div>
    </form>
  );
}
