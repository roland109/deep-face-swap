import { Activity, Cpu } from "lucide-react";
import { useEffect, useState } from "react";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const year = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined" ? window.location.hostname : "";
  const caffeineUrl = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`;

  const [blink, setBlink] = useState(true);
  useEffect(() => {
    const id = setInterval(() => setBlink((v) => !v), 600);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="dark min-h-screen flex flex-col bg-background text-foreground">
      {/* Header */}
      <header
        className="sticky top-0 z-50 border-b"
        style={{
          background: "oklch(0.12 0 0 / 0.92)",
          borderColor: "oklch(0.22 0 0 / 0.8)",
          backdropFilter: "blur(16px)",
        }}
      >
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 h-12 flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2.5" data-ocid="header.logo">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{
                background: "oklch(0.65 0.29 142 / 0.12)",
                border: "1px solid oklch(0.65 0.29 142 / 0.4)",
                boxShadow: "0 0 8px oklch(0.65 0.29 142 / 0.2)",
              }}
            >
              <Cpu className="w-3.5 h-3.5 neon-text" />
            </div>
            <div className="flex items-center gap-1">
              <span className="font-mono font-bold text-sm tracking-[0.15em] text-foreground">
                DEEP LIVE CAM
              </span>
              <span
                className="font-mono text-[10px] px-1.5 py-0.5 rounded ml-1"
                style={{
                  background: "oklch(0.65 0.29 142 / 0.1)",
                  border: "1px solid oklch(0.65 0.29 142 / 0.25)",
                  color: "oklch(0.65 0.29 142 / 0.8)",
                }}
              >
                v2.0 BETA
              </span>
            </div>
          </div>

          {/* Status indicators */}
          <div className="flex items-center gap-4 text-[11px] font-mono text-muted-foreground">
            <div className="hidden sm:flex items-center gap-1.5">
              <Activity className="w-3 h-3" />
              <span>AI FACE SWAP ENGINE</span>
            </div>
            <div
              className="flex items-center gap-2 px-2.5 py-1 rounded-full"
              style={{
                background: "oklch(0.65 0.29 142 / 0.08)",
                border: "1px solid oklch(0.65 0.29 142 / 0.25)",
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-accent pulse-glow" />
              <span className="text-accent text-[10px] font-bold tracking-widest">
                REPLICATE
              </span>
            </div>
          </div>
        </div>

        {/* Status bar */}
        <div
          className="border-t px-4 py-1 flex items-center gap-6 text-[10px] font-mono"
          style={{
            borderColor: "oklch(0.22 0 0 / 0.5)",
            background: "oklch(0.088 0 0 / 0.6)",
          }}
        >
          <span className="text-muted-foreground/60">SYS</span>
          <span className="text-accent/70 flex items-center gap-1">
            <span className="w-1 h-1 rounded-full bg-accent/60" />
            MODEL_READY
          </span>
          <span
            className="text-muted-foreground/50"
            style={{ opacity: blink ? 1 : 0, transition: "opacity 0.1s" }}
          >
            █
          </span>
          <span className="ml-auto text-muted-foreground/40">
            lucataco/faceswap@9a4298
          </span>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 bg-background">{children}</main>

      {/* Footer */}
      <footer
        className="border-t py-4"
        style={{
          background: "oklch(0.12 0 0 / 0.8)",
          borderColor: "oklch(0.22 0 0 / 0.6)",
        }}
      >
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-muted-foreground font-mono">
            © {year}. Built with love using{" "}
            <a
              href={caffeineUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:text-accent/80 transition-colors duration-200"
            >
              caffeine.ai
            </a>
          </p>
          <p className="text-[11px] text-muted-foreground/50 font-mono">
            FACE SWAP ENGINE · REPLICATE API · MODEL v9a4298
          </p>
        </div>
      </footer>
    </div>
  );
}
