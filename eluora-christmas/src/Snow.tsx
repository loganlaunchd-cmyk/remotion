import React, { useMemo } from "react";
import {
  AbsoluteFill,
  interpolate,
  random,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

type Flake = {
  x: number;
  y: number;
  size: number;
  speed: number;
  swayAmp: number;
  swayFreq: number;
  phase: number;
  blur: number;
  opacity: number;
};

const FLAKE_COUNT = 380;

// Three depth layers: far (tiny, sharp), mid, near (large, soft-blurred).
const makeFlake = (i: number): Flake => {
  const r = (k: string) => random(`snow-${k}-${i}`);
  const depth = r("depth");
  const layer = depth < 0.6 ? "far" : depth < 0.9 ? "mid" : "near";
  const size =
    layer === "far"
      ? 2 + r("s") * 3
      : layer === "mid"
        ? 6 + r("s") * 6
        : 18 + r("s") * 18;
  return {
    x: r("x"),
    y: r("y"),
    size,
    // Slow fall, nearer flakes fall a little faster (parallax)
    speed: layer === "far" ? 0.7 + r("v") * 0.5 : layer === "mid" ? 1.2 + r("v") * 0.7 : 2.0 + r("v") * 1.0,
    swayAmp: 10 + r("a") * (layer === "near" ? 40 : 22),
    swayFreq: 0.008 + r("f") * 0.014,
    phase: r("p") * Math.PI * 2,
    blur: layer === "far" ? 0 : layer === "mid" ? 0.6 : 2.5 + r("b") * 3.5,
    opacity: layer === "far" ? 0.45 + r("o") * 0.3 : layer === "mid" ? 0.6 + r("o") * 0.3 : 0.45 + r("o") * 0.3,
  };
};

export const Snow: React.FC<{
  // Keyframes for snow density over the whole video, 0..1
  densityFrames: number[];
  densityValues: number[];
}> = ({ densityFrames, densityValues }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const flakes = useMemo(
    () => new Array(FLAKE_COUNT).fill(true).map((_, i) => makeFlake(i)),
    [],
  );
  const density = interpolate(frame, densityFrames, densityValues, {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const visibleCount = density * FLAKE_COUNT;
  const scale = Math.min(width, height) / 1080;

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {flakes.map((f, i) => {
        // Fade flakes in/out smoothly as density changes instead of popping
        const presence = Math.max(0, Math.min(1, visibleCount - i));
        if (presence <= 0) {
          return null;
        }
        const size = f.size * scale;
        const travel = height + size * 4;
        const y = ((f.y * travel + f.speed * scale * frame) % travel) - size * 2;
        const x =
          f.x * (width + 80) -
          40 +
          Math.sin(frame * f.swayFreq + f.phase) * f.swayAmp * scale +
          frame * 0.15 * scale;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: size,
              height: size,
              borderRadius: "50%",
              translate: `${x}px ${y}px`,
              background:
                "radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(255,255,255,0.85) 40%, rgba(255,255,255,0) 72%)",
              filter: f.blur > 0 ? `blur(${f.blur * scale}px)` : undefined,
              opacity: f.opacity * presence,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
