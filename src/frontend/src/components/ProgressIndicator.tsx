import { AlertCircle, CheckCircle2, Loader2, Zap } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import type { SwapStatus } from "../types";

const CYCLING_MESSAGES = [
  "Preparing images…",
  "Swapping faces…",
  "Finalizing result…",
];

const CYCLE_INTERVAL_MS = 2200;

interface ProgressIndicatorProps {
  status: SwapStatus;
  elapsedSeconds: number;
  errorMessage: string | null;
}

export function ProgressIndicator({
  status,
  elapsedSeconds,
  errorMessage,
}: ProgressIndicatorProps) {
  const [cycleIndex, setCycleIndex] = useState(0);

  // Cycle through messages during polling
  useEffect(() => {
    if (status !== "polling") {
      setCycleIndex(0);
      return;
    }
    const id = setInterval(() => {
      setCycleIndex((i) => (i + 1) % CYCLING_MESSAGES.length);
    }, CYCLE_INTERVAL_MS);
    return () => clearInterval(id);
  }, [status]);

  const progress =
    status === "success"
      ? 100
      : status === "uploading"
        ? 12
        : status === "processing"
          ? 28
          : status === "polling"
            ? Math.min(28 + (elapsedSeconds / 120) * 68, 94)
            : 0;

  const label =
    status === "idle"
      ? "Upload both images to begin"
      : status === "uploading"
        ? "Preparing images…"
        : status === "processing"
          ? "Submitting to AI engine…"
          : status === "polling"
            ? CYCLING_MESSAGES[cycleIndex]
            : status === "success"
              ? "Face swap complete!"
              : (errorMessage ?? "An error occurred");

  const isActive = ["uploading", "processing", "polling"].includes(status);

  return (
    <div
      className="glass rounded-xl p-4 border border-border/60"
      data-ocid="swap.status_panel"
    >
      <div className="flex items-center gap-3 mb-3 min-h-[1.5rem]">
        {/* Icon */}
        {status === "error" ? (
          <AlertCircle className="w-4 h-4 text-destructive shrink-0" />
        ) : status === "success" ? (
          <CheckCircle2 className="w-4 h-4 text-accent shrink-0" />
        ) : isActive ? (
          <Loader2 className="w-4 h-4 text-accent shrink-0 animate-spin" />
        ) : (
          <Zap className="w-4 h-4 text-muted-foreground/50 shrink-0" />
        )}

        {/* Cycling label */}
        <AnimatePresence mode="wait">
          <motion.span
            key={label}
            className={`text-sm font-mono truncate
              ${status === "error" ? "text-destructive" : isActive || status === "success" ? "text-accent" : "text-muted-foreground"}
            `}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
          >
            {label}
          </motion.span>
        </AnimatePresence>

        {/* Elapsed timer */}
        {status === "polling" && (
          <span className="ml-auto text-xs text-muted-foreground font-mono shrink-0">
            {elapsedSeconds}s
          </span>
        )}
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-muted/40 rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full
            ${status === "error" ? "bg-destructive" : "bg-accent"}
          `}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}
