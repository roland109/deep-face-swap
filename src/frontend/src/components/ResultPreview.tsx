import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle2, Download, RefreshCw } from "lucide-react";
import { motion } from "motion/react";
import { useCallback } from "react";

interface ResultPreviewProps {
  resultUrl: string | null;
  errorMessage: string | null;
  onReset: () => void;
  onRetry: () => void;
}

export function ResultPreview({
  resultUrl,
  errorMessage,
  onReset,
  onRetry,
}: ResultPreviewProps) {
  const handleDownload = useCallback(() => {
    if (!resultUrl) return;
    const timestamp = Date.now();
    const a = document.createElement("a");
    a.href = resultUrl;
    a.download = `face-swap-${timestamp}.jpg`;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }, [resultUrl]);

  if (errorMessage) {
    return (
      <motion.div
        className="glass rounded-2xl p-5 border border-destructive/30 bg-destructive/5"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        data-ocid="swap.error_state"
      >
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-destructive mt-0.5 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground font-display">
              Something went wrong
            </p>
            <p className="text-xs text-muted-foreground mt-1 font-mono break-words">
              {errorMessage}
            </p>
            {errorMessage.includes("YOUR_REPLICATE_API_KEY") && (
              <p className="text-xs text-accent mt-2 leading-relaxed">
                Tip: Replace{" "}
                <code className="font-mono bg-muted/40 px-1 rounded text-accent">
                  YOUR_REPLICATE_API_KEY
                </code>{" "}
                in{" "}
                <code className="font-mono bg-muted/40 px-1 rounded text-accent">
                  hooks/useFaceSwap.ts
                </code>{" "}
                with your real Replicate API key.
              </p>
            )}
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          <Button
            size="sm"
            className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-glow font-display font-medium"
            onClick={onRetry}
            data-ocid="swap.retry_button"
          >
            Try Again
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="border-border/60 text-muted-foreground hover:text-foreground transition-smooth"
            onClick={onReset}
            data-ocid="swap.reset_button"
          >
            <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
            Start Over
          </Button>
        </div>
      </motion.div>
    );
  }

  if (!resultUrl) return null;

  return (
    <motion.div
      className="glass rounded-2xl p-6 border border-accent/30 shadow-glow-lg"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      data-ocid="swap.result_card"
    >
      {/* Header row */}
      <div className="flex items-center justify-between mb-4 gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <CheckCircle2 className="w-5 h-5 text-accent shrink-0" />
          <h2 className="font-display font-semibold text-foreground text-base truncate">
            Result
          </h2>
          <Badge className="bg-accent/10 text-accent border-accent/30 text-xs font-mono shrink-0">
            Ready
          </Badge>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            size="sm"
            variant="outline"
            className="border-border/60 text-muted-foreground hover:text-foreground transition-smooth font-display"
            onClick={onReset}
            data-ocid="swap.reset_button"
          >
            <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
            New Swap
          </Button>
          <Button
            size="sm"
            className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-glow font-display font-semibold"
            onClick={handleDownload}
            data-ocid="swap.download_button"
          >
            <Download className="w-4 h-4 mr-1.5" />
            Download
          </Button>
        </div>
      </div>

      {/* Result image */}
      <div className="rounded-xl overflow-hidden border border-accent/20 neon-border">
        <img
          src={resultUrl}
          alt="Face swap result"
          className="w-full max-h-[520px] object-contain bg-muted/20"
        />
      </div>

      {/* Download note */}
      <p className="text-xs text-muted-foreground/60 font-mono mt-3 text-center">
        Saved as{" "}
        <span className="text-accent/70">face-swap-[timestamp].jpg</span>
      </p>
    </motion.div>
  );
}
