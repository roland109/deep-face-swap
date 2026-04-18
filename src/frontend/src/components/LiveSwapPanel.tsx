import { Badge } from "@/components/ui/badge";
import { Activity, Cpu, Layers } from "lucide-react";
import { motion } from "motion/react";
import { useCallback, useState } from "react";
import { useFaceSwap } from "../hooks/useFaceSwap";
import type { CameraState, UploadedImage } from "../types";
import { CameraFeed } from "./CameraFeed";
import { ProgressIndicator } from "./ProgressIndicator";
import { ResultPreview } from "./ResultPreview";
import { UploadZone } from "./UploadZone";

export function LiveSwapPanel() {
  const { state, setSourceImage, setTargetImage, startSwap, reset } =
    useFaceSwap();
  const {
    status,
    sourceImage,
    targetImage,
    resultUrl,
    errorMessage,
    elapsedSeconds,
    swapCount,
  } = state;

  const [liveSwapOn, setLiveSwapOn] = useState(false);
  const [cameraState, setCameraState] = useState<CameraState>({
    isStreaming: false,
    hasPermission: null,
    capturedFrame: null,
    detectionActive: false,
  });

  const handleCameraStateChange = useCallback((patch: Partial<CameraState>) => {
    setCameraState((s) => ({ ...s, ...patch }));
  }, []);

  const handleFrameCapture = useCallback(
    (frame: UploadedImage) => {
      setCameraState((s) => ({ ...s, capturedFrame: frame }));
      setTargetImage(frame);
      if (liveSwapOn && sourceImage) {
        void startSwap();
      }
    },
    [liveSwapOn, sourceImage, setTargetImage, startSwap],
  );

  const handleSourceClear = useCallback(() => {
    setSourceImage(null);
  }, [setSourceImage]);

  const isProcessing = ["uploading", "processing", "polling"].includes(status);
  const isDone = status === "success" || status === "error";
  const canSwap =
    !!sourceImage &&
    (!!targetImage || !!cameraState.capturedFrame) &&
    !isProcessing &&
    !isDone;

  const handleSwap = useCallback(() => {
    if (cameraState.capturedFrame && !targetImage) {
      setTargetImage(cameraState.capturedFrame);
    }
    void startSwap();
  }, [cameraState.capturedFrame, targetImage, setTargetImage, startSwap]);

  const handleRetry = useCallback(() => void startSwap(), [startSwap]);

  return (
    <div className="flex flex-col gap-4" data-ocid="live_swap.panel">
      {/* Panel header bar */}
      <div
        className="flex items-center justify-between px-4 py-2.5 rounded-xl"
        style={{
          background: "oklch(0.12 0 0 / 0.8)",
          border: "1px solid oklch(0.22 0 0 / 0.7)",
          backdropFilter: "blur(12px)",
        }}
      >
        <div className="flex items-center gap-3">
          <Cpu className="w-4 h-4 text-accent" />
          <span className="font-mono text-sm font-bold text-foreground tracking-wider">
            DEEP LIVE CAM
          </span>
          <Badge
            className="font-mono text-[10px] px-1.5 py-0.5"
            style={{
              background: "oklch(0.65 0.29 142 / 0.12)",
              border: "1px solid oklch(0.65 0.29 142 / 0.3)",
              color: "oklch(0.65 0.29 142)",
            }}
          >
            v2.0 BETA
          </Badge>
        </div>

        <div className="flex items-center gap-4 text-[11px] font-mono text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <span
              className={`w-1.5 h-1.5 rounded-full ${cameraState.isStreaming ? "bg-accent pulse-glow" : "bg-red-500"}`}
            />
            <span
              className={
                cameraState.isStreaming ? "text-accent" : "text-red-400"
              }
            >
              {cameraState.isStreaming ? "LIVE" : "OFFLINE"}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Activity className="w-3 h-3" />
            <span>SWAPS: {swapCount}</span>
          </div>
          <div className="flex items-center gap-1">
            <Layers className="w-3 h-3" />
            <span>FPS: {cameraState.isStreaming ? "30" : "--"}</span>
          </div>
        </div>
      </div>

      {/* Main layout: camera (60%) + sidebar (40%) */}
      <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-4">
        {/* Camera feed */}
        <motion.div
          className="rounded-xl overflow-hidden"
          style={{
            background: "oklch(0.088 0 0)",
            border: "1px solid oklch(0.22 0 0 / 0.6)",
          }}
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          data-ocid="live_swap.camera_section"
        >
          <div className="p-3 h-full" style={{ minHeight: 400 }}>
            <CameraFeed
              cameraState={cameraState}
              onCameraStateChange={handleCameraStateChange}
              onFrameCapture={handleFrameCapture}
            />
          </div>
        </motion.div>

        {/* Control sidebar */}
        <motion.div
          className="flex flex-col gap-3"
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          data-ocid="live_swap.sidebar"
        >
          {/* Source face upload */}
          <div
            className="rounded-xl p-3"
            style={{
              background: "oklch(0.12 0 0 / 0.8)",
              border: "1px solid oklch(0.22 0 0 / 0.6)",
              backdropFilter: "blur(12px)",
            }}
          >
            <p className="text-[10px] font-mono font-bold tracking-widest text-muted-foreground mb-2.5 uppercase">
              Source Face
            </p>
            <UploadZone
              label="Upload Face Photo"
              sublabel="Clear frontal shot"
              stepNumber={1}
              image={sourceImage}
              onImageSelect={setSourceImage}
              onImageClear={handleSourceClear}
              ocid="live_swap.source"
              disabled={isProcessing}
            />
          </div>

          {/* Captured frame preview */}
          {cameraState.capturedFrame && (
            <div
              className="rounded-xl p-3 fade-in"
              style={{
                background: "oklch(0.12 0 0 / 0.8)",
                border: "1px solid oklch(0.65 0.29 142 / 0.25)",
                backdropFilter: "blur(12px)",
              }}
            >
              <p className="text-[10px] font-mono font-bold tracking-widest text-muted-foreground mb-2 uppercase">
                Captured Frame
              </p>
              <div className="relative rounded-lg overflow-hidden aspect-video">
                <img
                  src={cameraState.capturedFrame.previewUrl}
                  alt="Captured frame"
                  className="w-full h-full object-cover"
                />
                <div
                  className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded font-mono text-[9px] font-bold"
                  style={{
                    background: "oklch(0.088 0 0 / 0.85)",
                    color: "oklch(0.65 0.29 142)",
                    border: "1px solid oklch(0.65 0.29 142 / 0.3)",
                  }}
                >
                  FRAME CAPTURED
                </div>
              </div>
            </div>
          )}

          {/* Live swap toggle */}
          <div
            className="rounded-xl p-4 flex items-center justify-between"
            style={{
              background: "oklch(0.12 0 0 / 0.8)",
              border: `1px solid oklch(0.65 0.29 142 / ${liveSwapOn ? "0.5" : "0.2"})`,
              backdropFilter: "blur(12px)",
              boxShadow: liveSwapOn
                ? "0 0 20px oklch(0.65 0.29 142 / 0.15)"
                : "none",
            }}
          >
            <div>
              <p
                className="text-xs font-mono font-bold tracking-widest uppercase"
                style={{
                  color: liveSwapOn
                    ? "oklch(0.65 0.29 142)"
                    : "oklch(0.52 0 0)",
                }}
              >
                LIVE SWAP
              </p>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                {liveSwapOn ? "Auto-swap on capture" : "Manual mode"}
              </p>
            </div>

            {/* Toggle switch */}
            <button
              type="button"
              role="switch"
              aria-checked={liveSwapOn}
              onClick={() => setLiveSwapOn((v) => !v)}
              className="relative w-14 h-7 rounded-full transition-all duration-300 shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              style={{
                background: liveSwapOn
                  ? "oklch(0.65 0.29 142)"
                  : "oklch(0.22 0 0)",
                border: `1px solid oklch(0.65 0.29 142 / ${liveSwapOn ? "0.8" : "0.3"})`,
                boxShadow: liveSwapOn
                  ? "0 0 12px oklch(0.65 0.29 142 / 0.5)"
                  : "none",
              }}
              data-ocid="live_swap.live_toggle"
            >
              <span
                className="absolute top-0.5 w-6 h-6 rounded-full transition-all duration-300"
                style={{
                  left: liveSwapOn ? "calc(100% - 26px)" : "2px",
                  background: liveSwapOn
                    ? "oklch(0.088 0 0)"
                    : "oklch(0.4 0 0)",
                }}
              />
            </button>
          </div>

          {/* Swap action button */}
          {!isDone && (
            <button
              type="button"
              onClick={handleSwap}
              disabled={!canSwap || isProcessing}
              className="w-full py-3 rounded-xl font-mono text-sm font-bold tracking-widest transition-smooth disabled:opacity-40 disabled:cursor-not-allowed relative overflow-hidden"
              style={{
                background:
                  canSwap && !isProcessing
                    ? "oklch(0.65 0.29 142 / 0.2)"
                    : "oklch(0.12 0 0)",
                border: `1px solid oklch(0.65 0.29 142 / ${canSwap && !isProcessing ? "0.7" : "0.2"})`,
                color:
                  canSwap && !isProcessing
                    ? "oklch(0.65 0.29 142)"
                    : "oklch(0.4 0 0)",
                boxShadow:
                  canSwap && !isProcessing
                    ? "0 0 20px oklch(0.65 0.29 142 / 0.2)"
                    : "none",
              }}
              data-ocid="live_swap.swap_button"
            >
              {isProcessing ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-3 h-3 rounded-full border-2 border-amber-400 border-t-transparent animate-spin" />
                  PROCESSING...
                </span>
              ) : (
                "⚡ SWAP FACE"
              )}
            </button>
          )}

          {/* Progress */}
          <ProgressIndicator
            status={status}
            elapsedSeconds={elapsedSeconds}
            errorMessage={errorMessage}
          />

          {/* Result inline */}
          {isDone && (
            <div className="fade-in">
              <ResultPreview
                resultUrl={resultUrl}
                errorMessage={errorMessage}
                onReset={reset}
                onRetry={handleRetry}
              />
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
