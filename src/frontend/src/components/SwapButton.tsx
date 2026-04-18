import { Button } from "@/components/ui/button";
import { ArrowRight, RefreshCw, Zap } from "lucide-react";
import { motion } from "motion/react";

interface SwapButtonProps {
  canSwap: boolean;
  isProcessing: boolean;
  isDone: boolean;
  onSwap: () => void;
  onReset: () => void;
}

export function SwapButton({
  canSwap,
  isProcessing,
  isDone,
  onSwap,
  onReset,
}: SwapButtonProps) {
  if (isDone) {
    return (
      <Button
        variant="outline"
        className="w-full h-14 border-border/60 text-muted-foreground hover:text-foreground hover:border-accent/40 transition-smooth font-display font-semibold text-sm"
        onClick={onReset}
        data-ocid="swap.reset_button"
      >
        <RefreshCw className="w-4 h-4 mr-2" />
        Start Over
      </Button>
    );
  }

  return (
    <div className="relative">
      {/* Glow ring when enabled */}
      {canSwap && !isProcessing && (
        <motion.div
          className="absolute inset-0 rounded-xl bg-accent/20 blur-md"
          animate={{ opacity: [0.4, 0.7, 0.4] }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
      )}

      <Button
        className={`relative w-full h-14 font-display font-bold text-base tracking-wide transition-smooth
          ${
            canSwap && !isProcessing
              ? "bg-accent text-accent-foreground hover:bg-accent/90 shadow-glow"
              : "bg-accent/20 text-accent/50 shadow-none cursor-not-allowed"
          }
        `}
        onClick={onSwap}
        disabled={!canSwap || isProcessing}
        data-ocid="swap.submit_button"
        aria-label={isProcessing ? "Processing face swap" : "Swap faces"}
      >
        {isProcessing ? (
          <span className="flex items-center gap-2">
            <Zap className="w-5 h-5 animate-pulse" />
            <span>Processing…</span>
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            <span>Swap Faces</span>
            <ArrowRight className="w-4 h-4" />
          </span>
        )}
      </Button>
    </div>
  );
}
