import axios from "axios";
import { AlertCircle } from "lucide-react";

interface ErrorAlertProps {
  /** Direct message string to display. */
  message?: string;
  /** Error object — if an Axios error, the server message is extracted automatically. */
  error?: Error | null;
  /** Fallback message when `error` doesn't contain a server message. */
  fallback?: string;
  className?: string;
}

export function getErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.error ?? fallback;
  }
  return fallback;
}

export default function ErrorAlert({
  message,
  error,
  fallback = "Something went wrong",
  className,
}: ErrorAlertProps) {
  const text = message ?? getErrorMessage(error, fallback);

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-xl border border-destructive/25 bg-destructive/[0.06] text-[13.5px] text-destructive ${className ?? ""}`}
    >
      <AlertCircle className="h-4 w-4 shrink-0" />
      <p>{text}</p>
    </div>
  );
}
