# Design Brief

## Purpose
Real-time camera face-swap interface mimicking Deep Live Cam desktop app. Single-session face detection with live HUD overlays, glassmorphic control panels, Replicate API integration.

## Visual Direction
Cinematic retro-futuristic inspired by Deep Live Cam scanning interface and Blade Runner visuals. Dark charcoal base (#0f0f0f) with neon green (#00ff88) animated detection boxes. Camera feed dominated by HUD scan-line effect and corner markers. Premium, immersive, tech-forward.

## Tone
Confident, immersive, futuristic. Animated neon green scanning boxes signal active face detection. Scan-line effect adds cinema authenticity. Minimal text, maximum visual presence. Restrained drama — computation in motion.

## Differentiation
**Animated HUD bounding boxes** with scan-line effect overlay on camera feed. **Neon corner scan markers** at detection zones. **Live-swap toggle** with neon highlight. **Glassmorphic control panels** below feed with backdrop blur. **Pulsing glow on detection boxes** (1.5s cycle). No text clutter — visual feedback primary.

## Color Palette

| Token | OKLCH | Purpose |
|-------|-------|---------|
| Background | 0.088 0 0 | Charcoal base (#0f0f0f equivalent) |
| Card | 0.12 0 0 | Slightly elevated surface, supports glassmorphism |
| Border | 0.22 0 0 | Subtle dividers, supports glass effect |
| Accent (Neon Green) | 0.65 0.29 142 | Critical actions, highlights, glow effects |
| Foreground | 0.92 0 0 | Primary text, high contrast |
| Muted | 0.18 0 0 | Secondary text, disabled states |

## Typography

| Layer | Font | Usage | Weight | Size |
|-------|------|-------|--------|------|
| Display | General Sans | Headlines, hero | 600–700 | 32–48px |
| Body | Figtree | Content, labels | 400–500 | 14–16px |
| Mono | JetBrains Mono | Code, timestamps | 400 | 12–14px |

## Elevation & Depth
- **Base surface**: Dark background (0.088 0 0)
- **Card layer**: Elevated card (0.12 0 0) with backdrop blur
- **Interactive layer**: Neon green borders/text on hover, glow shadow

## Structural Zones

| Zone | Background | Border | Treatment |
|------|------------|--------|-----------|
| Header | Gradient subtle (0.16→0.12) | Neon green 30% | App title left, status indicator right |
| Camera Feed | Background + overlay | Neon 60% | Scan-line effect, HUD detection boxes, corners |
| Detection Box | Transparent | Neon 60% + inset glow | Pulsing animation, positioned on faces |
| Control Panel | Card 50% opacity + 12px blur | Neon 40% | Live-swap toggle, buttons, settings |
| Button Primary | Accent (neon) | Accent | Positioned below feed, icon + label |
| Scan Indicator | Transparent | Neon 100% | 12px corner markers at detection zones |
| Footer | Muted 30% | Border 22% | Minimal status, processing indicator |

## Spacing & Rhythm
8px grid. Gutters: 16px (mobile), 32px (tablet), 48px (desktop). Vertical rhythm: 8px, 16px, 24px, 32px. Cards: 24px padding interior, 16px gap between elements.

## Component Patterns
- **Camera feed**: Bordered container with scan-line overlay (8s infinite), hud-box class for detection markers
- **HUD bounding box**: Neon border (60% opacity), inset glow, pulsing animation (1.5s), positioned absolutely over feed
- **Scan corner**: 12px neon border markers at detection zone corners
- **Live-swap toggle**: Card-based switch with neon accent highlight, smooth transition
- **Control panel**: Glassmorphic card (50% opacity, 12px blur), neon borders, dark background
- **Button**: Neon background, white text, shadow, smooth hover, positioned in control zone

## Motion & Animation
- **Scan-line**: 8s linear infinite, traverses camera feed top-to-bottom, 12px height, neon tint
- **HUD pulse**: 1.5s ease-in-out infinite on detection boxes, glow intensifies at 50%, inset + outer shadows
- **Fade-in**: 200ms ease-out for control elements (staggered 100ms per child)
- **Hover transitions**: 300ms cubic-bezier(0.4, 0, 0.2, 1) on buttons
- **Live-swap toggle**: Smooth state change, neon highlight on active

## Constraints
- No full-page gradients (use layered surface elevation instead)
- No floating particles or background animations (preserve performance)
- Neon glow used sparingly: accent text, hover states, processing status only
- Glass effect reserved for primary cards (upload zones, status)
- Font weight never below 400 (readability on dark backgrounds)
- Text shadow only on neon elements (prevent clutter)

## Signature Detail
**Animated scan-line effect**: Horizontal line traverses camera feed (8s cycle), reinforces Deep Live Cam scanning aesthetic and real-time processing feel. **Pulsing neon HUD boxes**: Detection bounding boxes with dual-layer glow (inset + outer) create dimensional depth perception — suggests camera hardware, not software UI.
