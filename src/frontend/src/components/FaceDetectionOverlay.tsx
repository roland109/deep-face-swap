import { useEffect, useState } from "react";

interface FaceDetectionOverlayProps {
  isActive: boolean;
  width?: number;
  height?: number;
}

export function FaceDetectionOverlay({
  isActive,
  width = 220,
  height = 270,
}: FaceDetectionOverlayProps) {
  const [visible, setVisible] = useState(false);
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    if (!isActive) {
      setVisible(false);
      return;
    }
    const t = setTimeout(() => {
      setVisible(true);
    }, 1500);
    return () => clearTimeout(t);
  }, [isActive]);

  const handleInteraction = () => {
    if (!visible) return;
    setFlash(true);
    setTimeout(() => setFlash(false), 300);
  };

  // Center box position
  const left = `calc(50% - ${width / 2}px)`;
  const top = `calc(50% - ${height / 2}px)`;

  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden"
      aria-hidden="true"
    >
      {/* Scan line sweep */}
      {isActive && (
        <div
          className="absolute left-0 right-0 h-[2px] pointer-events-none"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, oklch(0.65 0.29 142 / 0.6) 40%, oklch(0.65 0.29 142 / 0.9) 50%, oklch(0.65 0.29 142 / 0.6) 60%, transparent 100%)",
            animation: "scanline 4s linear infinite",
            top: 0,
          }}
        />
      )}

      {/* CRT scanlines overlay */}
      {isActive && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "repeating-linear-gradient(0deg, transparent, transparent 2px, oklch(0 0 0 / 0.05) 2px, oklch(0 0 0 / 0.05) 4px)",
          }}
        />
      )}

      {/* Detection box */}
      {isActive && (
        // biome-ignore lint/a11y/useKeyWithClickEvents: overlay interaction only
        <div
          className="absolute pointer-events-auto cursor-pointer"
          style={{ left, top, width, height }}
          onClick={handleInteraction}
        >
          {/* Box border - dashed animated */}
          <div
            className={`absolute inset-0 transition-all duration-300 ${
              visible
                ? flash
                  ? "border-2 border-solid border-white"
                  : "hud-box hud-box-animate"
                : "border-2 border-dashed border-accent/30"
            }`}
            style={
              visible && !flash
                ? {}
                : {
                    borderColor: visible
                      ? "white"
                      : "oklch(0.65 0.29 142 / 0.3)",
                  }
            }
          />

          {/* Corner markers — TL */}
          <span
            className="scan-corner"
            style={{
              top: -1,
              left: -1,
              borderRight: "none",
              borderBottom: "none",
              borderColor: visible
                ? "oklch(0.65 0.29 142)"
                : "oklch(0.65 0.29 142 / 0.4)",
            }}
          />
          {/* TR */}
          <span
            className="scan-corner"
            style={{
              top: -1,
              right: -1,
              borderLeft: "none",
              borderBottom: "none",
              borderColor: visible
                ? "oklch(0.65 0.29 142)"
                : "oklch(0.65 0.29 142 / 0.4)",
            }}
          />
          {/* BL */}
          <span
            className="scan-corner"
            style={{
              bottom: -1,
              left: -1,
              borderRight: "none",
              borderTop: "none",
              borderColor: visible
                ? "oklch(0.65 0.29 142)"
                : "oklch(0.65 0.29 142 / 0.4)",
            }}
          />
          {/* BR */}
          <span
            className="scan-corner"
            style={{
              bottom: -1,
              right: -1,
              borderLeft: "none",
              borderTop: "none",
              borderColor: visible
                ? "oklch(0.65 0.29 142)"
                : "oklch(0.65 0.29 142 / 0.4)",
            }}
          />

          {/* Status label — top */}
          <div className="absolute -top-7 left-0 right-0 flex items-center justify-between px-1">
            <span
              className="text-[10px] font-mono font-bold tracking-widest"
              style={{
                color: visible
                  ? "oklch(0.65 0.29 142)"
                  : "oklch(0.65 0.29 142 / 0.5)",
              }}
            >
              {visible ? "FACE DETECTED" : "SCANNING..."}
            </span>
            {visible && (
              <span
                className="text-[10px] font-mono"
                style={{ color: "oklch(0.65 0.29 142 / 0.8)" }}
              >
                98.7%
              </span>
            )}
          </div>

          {/* Confidence bar — bottom */}
          {visible && (
            <div className="absolute -bottom-6 left-0 right-0 flex items-center gap-1.5 px-1">
              <div
                className="flex-1 h-[3px] rounded-full overflow-hidden"
                style={{ background: "oklch(0.65 0.29 142 / 0.2)" }}
              >
                <div
                  className="h-full rounded-full"
                  style={{
                    width: "98.7%",
                    background: "oklch(0.65 0.29 142)",
                    boxShadow: "0 0 6px oklch(0.65 0.29 142 / 0.7)",
                  }}
                />
              </div>
              <span
                className="text-[9px] font-mono shrink-0"
                style={{ color: "oklch(0.65 0.29 142 / 0.7)" }}
              >
                CONF
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
