import { Badge } from "@/components/ui/badge";
import { Download, Image, Monitor } from "lucide-react";
import { motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import { LiveSwapPanel } from "../components/LiveSwapPanel";
import { ProgressIndicator } from "../components/ProgressIndicator";
import { ResultPreview } from "../components/ResultPreview";
import { SwapButton } from "../components/SwapButton";
import { UploadZone } from "../components/UploadZone";
import { useFaceSwap } from "../hooks/useFaceSwap";
import type { LiveSwapMode } from "../types";

export function HomePage() {
  const { state, setSourceImage, setTargetImage, startSwap, reset } =
    useFaceSwap();
  const {
    status,
    sourceImage,
    targetImage,
    resultUrl,
    errorMessage,
    elapsedSeconds,
  } = state;

  const [mode, setMode] = useState<LiveSwapMode>("live-cam");
  const [cursorOn, setCursorOn] = useState(true);

  // Blinking cursor
  useEffect(() => {
    const id = setInterval(() => setCursorOn((v) => !v), 530);
    return () => clearInterval(id);
  }, []);

  const isProcessing = ["uploading", "processing", "polling"].includes(status);
  const isDone = status === "success" || status === "error";
  const canSwap = !!sourceImage && !!targetImage && !isProcessing && !isDone;

  const handleDownload = useCallback(() => {
    if (!resultUrl) return;
    const a = document.createElement("a");
    a.href = resultUrl;
    a.download = `deep-live-cam-${Date.now()}.jpg`;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }, [resultUrl]);

  const handleClearSource = useCallback(
    () => setSourceImage(null),
    [setSourceImage],
  );
  const handleClearTarget = useCallback(
    () => setTargetImage(null),
    [setTargetImage],
  );
  const handleRetry = useCallback(() => void startSwap(), [startSwap]);

  return (
    <div className="min-h-[calc(100vh-5rem)] flex flex-col">
      {/* Hero header */}
      <section
        className="relative py-8 sm:py-12 overflow-hidden"
        data-ocid="hero.section"
        style={{ background: "oklch(0.088 0 0)" }}
      >
        {/* Neural grid bg */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "url('/assets/generated/hero-neural-bg.dim_1400x600.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          aria-hidden="true"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, oklch(0.088 0 0 / 0.3) 0%, oklch(0.088 0 0 / 0.7) 70%, oklch(0.088 0 0) 100%)",
          }}
          aria-hidden="true"
        />

        {/* Grid lines overlay */}
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(oklch(0.65 0.29 142) 1px, transparent 1px), linear-gradient(90deg, oklch(0.65 0.29 142) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
          aria-hidden="true"
        />

        <div className="relative container max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
          >
            <Badge
              className="mb-4 font-mono text-[10px] px-3 py-1 tracking-widest"
              style={{
                background: "oklch(0.65 0.29 142 / 0.1)",
                border: "1px solid oklch(0.65 0.29 142 / 0.35)",
                color: "oklch(0.65 0.29 142)",
              }}
              data-ocid="hero.badge"
            >
              ◉ REAL-TIME AI FACE SWAP · POWERED BY REPLICATE
            </Badge>
          </motion.div>

          <motion.h1
            className="font-mono text-4xl sm:text-5xl lg:text-6xl font-bold tracking-[0.05em] mb-3"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.06 }}
          >
            <span className="neon-text pulse-glow">DEEP LIVE CAM</span>
            <span
              className="ml-1 inline-block w-[3px] h-[0.85em] align-middle"
              style={{
                background: "oklch(0.65 0.29 142)",
                opacity: cursorOn ? 1 : 0,
                transition: "opacity 0.1s",
              }}
              aria-hidden="true"
            />
          </motion.h1>

          <motion.p
            className="text-sm sm:text-base text-muted-foreground font-mono max-w-xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.15 }}
          >
            Live camera face detection · AI-powered swap · No account required
          </motion.p>
        </div>
      </section>

      {/* Mode tab switcher */}
      <div
        className="border-b px-4 sm:px-6"
        style={{
          background: "oklch(0.10 0 0)",
          borderColor: "oklch(0.22 0 0 / 0.6)",
        }}
        data-ocid="mode.tabs"
      >
        <div className="container max-w-6xl mx-auto flex gap-0">
          {(
            [
              { id: "live-cam", icon: Monitor, label: "📹 LIVE CAM" },
              { id: "photo", icon: Image, label: "📸 PHOTO MODE" },
            ] as const
          ).map(({ id, label }) => {
            const active = mode === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setMode(id)}
                className="relative px-5 py-3 font-mono text-xs font-bold tracking-widest transition-smooth"
                style={{
                  color: active ? "oklch(0.65 0.29 142)" : "oklch(0.45 0 0)",
                  borderBottom: active
                    ? "2px solid oklch(0.65 0.29 142)"
                    : "2px solid transparent",
                  background: active
                    ? "oklch(0.65 0.29 142 / 0.05)"
                    : "transparent",
                }}
                data-ocid={`mode.${id}_tab`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main content */}
      <div
        className="flex-1 py-6 sm:py-8"
        style={{ background: "oklch(0.09 0 0)" }}
      >
        <div className="container max-w-6xl mx-auto px-4 sm:px-6">
          {mode === "live-cam" ? (
            <motion.div
              key="live-cam"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              data-ocid="live_cam.section"
            >
              <LiveSwapPanel />
            </motion.div>
          ) : (
            <motion.div
              key="photo"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              data-ocid="photo_mode.section"
            >
              {/* Photo mode header */}
              <div className="flex items-center gap-3 mb-5">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{
                    background: "oklch(0.65 0.29 142 / 0.1)",
                    border: "1px solid oklch(0.65 0.29 142 / 0.3)",
                  }}
                >
                  <Image className="w-4 h-4 text-accent" />
                </div>
                <div>
                  <p className="font-mono text-sm font-bold text-foreground tracking-wider">
                    PHOTO MODE
                  </p>
                  <p className="text-xs text-muted-foreground font-mono">
                    Upload source + target images
                  </p>
                </div>
              </div>

              {/* Upload zones */}
              <div
                className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5"
                data-ocid="photo_mode.uploads"
              >
                <div
                  className="rounded-xl p-4"
                  style={{
                    background: "oklch(0.12 0 0 / 0.8)",
                    border: "1px solid oklch(0.22 0 0 / 0.6)",
                    backdropFilter: "blur(12px)",
                  }}
                >
                  <UploadZone
                    label="Upload Your Face"
                    sublabel="Clear frontal shot works best"
                    stepNumber={1}
                    image={sourceImage}
                    onImageSelect={setSourceImage}
                    onImageClear={handleClearSource}
                    ocid="photo_source.dropzone"
                    disabled={isProcessing}
                  />
                </div>

                <div
                  className="rounded-xl p-4"
                  style={{
                    background: "oklch(0.12 0 0 / 0.8)",
                    border: "1px solid oklch(0.22 0 0 / 0.6)",
                    backdropFilter: "blur(12px)",
                  }}
                >
                  <UploadZone
                    label="Upload Target Image"
                    sublabel="Any photo with a visible face"
                    stepNumber={2}
                    image={targetImage}
                    onImageSelect={setTargetImage}
                    onImageClear={handleClearTarget}
                    ocid="photo_target.dropzone"
                    disabled={isProcessing}
                  />
                </div>
              </div>

              {/* Controls row */}
              <div className="flex flex-col sm:flex-row gap-4 items-stretch mb-5">
                <div className="flex-1">
                  <ProgressIndicator
                    status={status}
                    elapsedSeconds={elapsedSeconds}
                    errorMessage={errorMessage}
                  />
                </div>
                <div className="sm:w-48">
                  <SwapButton
                    canSwap={canSwap}
                    isProcessing={isProcessing}
                    isDone={isDone}
                    onSwap={() => void startSwap()}
                    onReset={reset}
                  />
                </div>
              </div>

              {/* Result */}
              {isDone && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mb-5"
                >
                  <ResultPreview
                    resultUrl={resultUrl}
                    errorMessage={errorMessage}
                    onReset={reset}
                    onRetry={handleRetry}
                  />
                </motion.div>
              )}

              {/* Download shortcut */}
              {status === "success" && resultUrl && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="flex justify-center"
                >
                  <button
                    type="button"
                    onClick={handleDownload}
                    className="flex items-center gap-2 text-xs text-accent/70 hover:text-accent transition-colors font-mono"
                    data-ocid="photo_mode.download_shortcut"
                  >
                    <Download className="w-3 h-3" />
                    deep-live-cam-[timestamp].jpg
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* API key note */}
          <p
            className="text-center text-[11px] text-muted-foreground/40 font-mono mt-6"
            data-ocid="home.api_key_note"
          >
            Using placeholder API key — replace{" "}
            <code className="text-accent/50 bg-muted/20 px-1 rounded">
              YOUR_REPLICATE_API_KEY
            </code>{" "}
            in{" "}
            <code className="text-accent/50 bg-muted/20 px-1 rounded">
              hooks/useFaceSwap.ts
            </code>{" "}
            to activate
          </p>
        </div>
      </div>
    </div>
  );
}
