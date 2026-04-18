import { Camera, CameraOff, Crosshair, Eye, EyeOff, Radio } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { CameraState, UploadedImage } from "../types";
import { FaceDetectionOverlay } from "./FaceDetectionOverlay";

interface CameraFeedProps {
  cameraState: CameraState;
  onCameraStateChange: (state: Partial<CameraState>) => void;
  onFrameCapture: (frame: UploadedImage) => void;
}

export function CameraFeed({
  cameraState,
  onCameraStateChange,
  onFrameCapture,
}: CameraFeedProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [resolution, setResolution] = useState<string>("--");
  const [showHud, setShowHud] = useState(true);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      for (const track of streamRef.current.getTracks()) track.stop();
      streamRef.current = null;
    }
    if (videoRef.current) videoRef.current.srcObject = null;
    onCameraStateChange({
      isStreaming: false,
      detectionActive: false,
    });
    setResolution("--");
  }, [onCameraStateChange]);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "user",
        },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          const w = videoRef.current?.videoWidth ?? 0;
          const h = videoRef.current?.videoHeight ?? 0;
          setResolution(`${w}×${h}`);
        };
      }
      onCameraStateChange({
        isStreaming: true,
        hasPermission: true,
        detectionActive: true,
      });
    } catch {
      onCameraStateChange({ isStreaming: false, hasPermission: false });
    }
  }, [onCameraStateChange]);

  const captureFrame = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0);
    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        const file = new File([blob], `capture-${Date.now()}.jpg`, {
          type: "image/jpeg",
        });
        const previewUrl = URL.createObjectURL(blob);
        onFrameCapture({ file, previewUrl });
      },
      "image/jpeg",
      0.92,
    );
  }, [onFrameCapture]);

  const startCameraRef = useRef(startCamera);
  const stopCameraRef = useRef(stopCamera);
  startCameraRef.current = startCamera;
  stopCameraRef.current = stopCamera;

  // Auto-start on mount
  useEffect(() => {
    void startCameraRef.current();
    return () => stopCameraRef.current();
  }, []);

  const { isStreaming, hasPermission, detectionActive } = cameraState;

  return (
    <div className="relative w-full h-full flex flex-col">
      {/* Camera viewport */}
      <div
        className="relative flex-1 rounded-xl overflow-hidden bg-black"
        style={{ minHeight: 320 }}
      >
        {/* Video feed */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
          style={{ display: isStreaming ? "block" : "none" }}
        />
        <canvas ref={canvasRef} className="hidden" />

        {/* Permission denied / off state */}
        {!isStreaming && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-background/90">
            {hasPermission === false ? (
              <>
                <div className="w-16 h-16 rounded-full bg-destructive/10 border border-destructive/30 flex items-center justify-center">
                  <CameraOff className="w-7 h-7 text-destructive" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-mono text-foreground font-semibold">
                    CAMERA ACCESS DENIED
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Allow camera permission and retry
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => void startCamera()}
                  className="px-4 py-2 rounded-lg font-mono text-xs font-bold transition-smooth"
                  style={{
                    background: "oklch(0.65 0.29 142 / 0.15)",
                    border: "1px solid oklch(0.65 0.29 142 / 0.4)",
                    color: "oklch(0.65 0.29 142)",
                  }}
                  data-ocid="camera.retry_button"
                >
                  RETRY
                </button>
              </>
            ) : (
              <>
                <div className="w-16 h-16 rounded-full bg-accent/10 border border-accent/30 flex items-center justify-center">
                  <Camera className="w-7 h-7 text-accent animate-pulse" />
                </div>
                <p className="text-sm font-mono text-accent">INITIALIZING...</p>
              </>
            )}
          </div>
        )}

        {/* HUD overlays */}
        {isStreaming && showHud && (
          <FaceDetectionOverlay isActive={detectionActive} />
        )}

        {/* LIVE badge — top left */}
        {isStreaming && (
          <div
            className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full"
            style={{
              background: "oklch(0.088 0 0 / 0.75)",
              border: "1px solid oklch(0.65 0.19 22 / 0.6)",
              backdropFilter: "blur(8px)",
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 pulse-glow" />
            <span className="text-[10px] font-mono font-bold tracking-widest text-red-400">
              LIVE
            </span>
          </div>
        )}

        {/* HUD toggle — top right */}
        {isStreaming && (
          <button
            type="button"
            onClick={() => setShowHud((v) => !v)}
            className="absolute top-3 right-3 w-8 h-8 rounded-lg flex items-center justify-center transition-smooth"
            style={{
              background: "oklch(0.088 0 0 / 0.75)",
              border: `1px solid oklch(0.65 0.29 142 / ${showHud ? "0.5" : "0.2"})`,
              backdropFilter: "blur(8px)",
            }}
            aria-label={showHud ? "Hide HUD" : "Show HUD"}
            data-ocid="camera.hud_toggle"
          >
            {showHud ? (
              <Eye className="w-3.5 h-3.5 text-accent" />
            ) : (
              <EyeOff className="w-3.5 h-3.5 text-muted-foreground" />
            )}
          </button>
        )}

        {/* Resolution — bottom right */}
        {isStreaming && (
          <div
            className="absolute bottom-3 right-3 px-2 py-0.5 rounded font-mono text-[10px]"
            style={{
              background: "oklch(0.088 0 0 / 0.7)",
              color: "oklch(0.65 0.29 142 / 0.7)",
              backdropFilter: "blur(4px)",
            }}
          >
            {resolution}
          </div>
        )}

        {/* System label — bottom left */}
        {isStreaming && (
          <div
            className="absolute bottom-3 left-3 flex items-center gap-1 px-2 py-0.5 rounded font-mono text-[10px]"
            style={{
              background: "oklch(0.088 0 0 / 0.7)",
              color: "oklch(0.65 0.29 142 / 0.6)",
              backdropFilter: "blur(4px)",
            }}
          >
            <Radio className="w-3 h-3" />
            DLC_STREAM
          </div>
        )}
      </div>

      {/* Capture button row */}
      <div className="mt-3 flex items-center gap-3">
        <button
          type="button"
          onClick={captureFrame}
          disabled={!isStreaming}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg font-mono text-xs font-bold tracking-widest transition-smooth disabled:opacity-40 disabled:cursor-not-allowed"
          style={{
            background: isStreaming
              ? "oklch(0.65 0.29 142 / 0.15)"
              : "oklch(0.12 0 0)",
            border: `1px solid oklch(0.65 0.29 142 / ${isStreaming ? "0.5" : "0.2"})`,
            color: isStreaming ? "oklch(0.65 0.29 142)" : "oklch(0.52 0 0)",
          }}
          data-ocid="camera.capture_button"
        >
          <Crosshair className="w-3.5 h-3.5" />
          CAPTURE FRAME
        </button>

        <button
          type="button"
          onClick={isStreaming ? stopCamera : () => void startCamera()}
          className="px-4 py-2.5 rounded-lg font-mono text-xs font-bold tracking-widest transition-smooth"
          style={{
            background: isStreaming
              ? "oklch(0.65 0.19 22 / 0.12)"
              : "oklch(0.65 0.29 142 / 0.12)",
            border: `1px solid oklch(${isStreaming ? "0.65 0.19 22" : "0.65 0.29 142"} / 0.35)`,
            color: isStreaming ? "oklch(0.65 0.19 22)" : "oklch(0.65 0.29 142)",
          }}
          data-ocid={isStreaming ? "camera.stop_button" : "camera.start_button"}
        >
          {isStreaming ? "STOP" : "START"}
        </button>
      </div>
    </div>
  );
}
