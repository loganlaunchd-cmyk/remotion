import React from "react";
import {
  AbsoluteFill,
  Easing,
  getStaticFiles,
  Img,
  Interactive,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { BLACK, GOLD, IVORY, SERIF } from "./theme";

const ease = Easing.bezier(0.33, 0, 0.2, 1);

const fileExists = (name: string) =>
  getStaticFiles().some((f) => f.name === name);

// Shows the real photo from /public, or a clearly-labelled placeholder until
// the file is added. The photo itself is never altered, only framed and moved.
// Landscape: a right-hand panel at (near) native resolution that fades into
// black on its left edge. Vertical: full bleed.
const Photo: React.FC<{
  file: string;
  aspect: number;
  fade: number;
  // Vertical only: "cover" fills the frame, "width" shows the whole photo
  // width as a band fading into black above and below.
  verticalFit: "cover" | "width";
  style: React.CSSProperties;
}> = ({ file, aspect, fade, verticalFit, style }) => {
  const { width, height } = useVideoConfig();
  const vertical = height > width;
  const band = vertical && verticalFit === "width";
  const panelStyle: React.CSSProperties = vertical
    ? {
        position: "absolute",
        left: 0,
        width: "100%",
        top: band ? (height - width / aspect) / 2 + 120 : 0,
        height: band ? width / aspect : "100%",
        overflow: "hidden",
        maskImage: band
          ? "linear-gradient(to bottom, transparent 0%, black 14%, black 88%, transparent 100%)"
          : undefined,
      }
    : {
        position: "absolute",
        top: 0,
        right: 0,
        height: "100%",
        width: Math.min(width * 0.68, height * aspect),
        overflow: "hidden",
        maskImage: `linear-gradient(to right, transparent 0%, black ${fade}%)`,
      };
  if (!fileExists(file)) {
    return (
      <div
        style={{
          ...panelStyle,
          backgroundColor: "#141210",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "rgba(201,164,92,0.6)",
          fontFamily: "monospace",
          fontSize: 28,
        }}
      >
        missing public/{file}
      </div>
    );
  }
  return (
    <div style={panelStyle}>
      <Img
        src={staticFile(file)}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          ...style,
        }}
      />
    </div>
  );
};

// Darkened edges + bottom gradient so the ivory headline always reads.
const Grade: React.FC<{ verticalPosition: "top" | "bottom" }> = ({
  verticalPosition,
}) => {
  const { width, height } = useVideoConfig();
  const vertical = height > width;
  return (
    <AbsoluteFill
      style={{
        background: vertical
          ? `radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 50%, rgba(0,0,0,0.5) 100%), linear-gradient(${verticalPosition === "top" ? "to top" : "to bottom"}, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 62%, rgba(0,0,0,0.78) 100%)`
          : "radial-gradient(ellipse at 70% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.45) 100%)",
      }}
    />
  );
};

export const Headline: React.FC<{
  text: string;
  delay: number;
  verticalPosition: "top" | "bottom";
}> = ({ text, delay, verticalPosition }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const vertical = height > width;
  return (
    <AbsoluteFill
      style={
        vertical
          ? {
              justifyContent:
                verticalPosition === "top" ? "flex-start" : "flex-end",
              alignItems: "center",
              textAlign: "center",
              paddingTop: 250,
              paddingBottom: 190,
              paddingLeft: 90,
              paddingRight: 90,
            }
          : {
              justifyContent: "center",
              alignItems: "flex-start",
              textAlign: "left",
              paddingLeft: 130,
              width: 760,
            }
      }
    >
      <Interactive.Div
        name="Gold rule"
        style={{
          width: 120,
          height: 1.5,
          backgroundColor: GOLD,
          marginBottom: vertical ? 44 : 34,
          scale: interpolate(frame, [delay, delay + 1.4 * fps], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: ease,
          }),
          opacity: interpolate(frame, [delay, delay + 0.8 * fps], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      />
      <Interactive.Div
        name="Headline"
        style={{
          fontFamily: SERIF,
          fontWeight: 300,
          fontSize: vertical ? 88 : 78,
          whiteSpace: "pre-line",
          lineHeight: 1.12,
          letterSpacing: "0.02em",
          color: IVORY,
          textShadow: "0 2px 30px rgba(0,0,0,0.6)",
          opacity: interpolate(frame, [delay, delay + 1.3 * fps], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: ease,
          }),
          translate: interpolate(
            frame,
            [delay, delay + 1.8 * fps],
            ["0px 18px", "0px 0px"],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease },
          ),
          filter: `blur(${interpolate(frame, [delay, delay + 1.3 * fps], [6, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: ease,
          })}px)`,
        }}
      >
        {text}
      </Interactive.Div>
    </AbsoluteFill>
  );
};

// 0–4s: holding case, slow Ken Burns zoom in
export const HoldingCaseScene: React.FC<{ file: string }> = ({ file }) => {
  const frame = useCurrentFrame();
  const { durationInFrames, width, height } = useVideoConfig();
  const vertical = height > width;
  return (
    <AbsoluteFill style={{ backgroundColor: BLACK, overflow: "hidden" }}>
      <Photo
        file={file}
        aspect={1086 / 1448}
        fade={22}
        verticalFit="cover"
        style={{
          objectPosition: "50% 50%",
          scale: interpolate(frame, [0, durationInFrames], [1.0, 1.12], {
            extrapolateRight: "clamp",
          }),
          transformOrigin: vertical ? "50% 48%" : "50% 52%",
        }}
      />
      <Grade verticalPosition="bottom" />
      <Headline
        text={"The Art of\nComing Home"}
        delay={18}
        verticalPosition="bottom"
      />
    </AbsoluteFill>
  );
};

// 4–8s: product line-up, slow pan left → right with warm gold glow
export const LineupScene: React.FC<{ file: string }> = ({ file }) => {
  const frame = useCurrentFrame();
  const { durationInFrames, width, height } = useVideoConfig();
  const vertical = height > width;
  return (
    <AbsoluteFill style={{ backgroundColor: BLACK, overflow: "hidden" }}>
      <Photo
        file={file}
        aspect={(1067 / 928) * 0.96}
        fade={4}
        verticalFit="cover"
        style={{
          scale: vertical ? 1 : 1.04,
          objectPosition: interpolate(
            frame,
            [0, durationInFrames],
            vertical ? ["12% 50%", "88% 50%"] : ["0% 50%", "100% 50%"],
            { extrapolateRight: "clamp" },
          ),
        }}
      />
      <AbsoluteFill
        style={{
          mixBlendMode: "screen",
          background:
            "radial-gradient(ellipse 45% 50% at 50% 40%, rgba(201,164,92,0.42) 0%, rgba(201,164,92,0.12) 45%, rgba(201,164,92,0) 75%)",
          opacity: interpolate(
            frame,
            [0, durationInFrames * 0.5, durationInFrames],
            [0.35, 0.8, 0.55],
          ),
          translate: interpolate(
            frame,
            [0, durationInFrames],
            vertical ? ["-25% 0%", "25% 0%"] : ["0% 0%", "30% 0%"],
          ),
        }}
      />
      <Grade verticalPosition="bottom" />
      <Headline
        text={"Six rituals from\nthe Estonian bog"}
        delay={22}
        verticalPosition="bottom"
      />
    </AbsoluteFill>
  );
};

// 8–12s: open case, slow zoom towards the products
export const OpenCaseScene: React.FC<{ file: string }> = ({ file }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: BLACK, overflow: "hidden" }}>
      <Photo
        file={file}
        aspect={935 / 1066}
        fade={18}
        verticalFit="width"
        style={{
          objectPosition: "50% 50%",
          scale: interpolate(frame, [0, durationInFrames], [1.0, 1.14], {
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.4, 0, 0.6, 1),
          }),
          transformOrigin: "50% 60%",
        }}
      />
      <Grade verticalPosition="top" />
      <Headline
        text={"A little luxury.\nA moment for yourself."}
        delay={22}
        verticalPosition="top"
      />
    </AbsoluteFill>
  );
};

// 12–15s: black end card with the gold ELUORA logo
export const EndCard: React.FC<{ logoFile: string }> = ({ logoFile }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const vertical = height > width;
  const hasLogo = fileExists(logoFile);
  return (
    <AbsoluteFill
      style={{
        backgroundColor: BLACK,
        justifyContent: "center",
        alignItems: "center",
        background: `radial-gradient(ellipse at 50% 50%, #17130d 0%, ${BLACK} 65%)`,
      }}
    >
      <Interactive.Div
        name="Logo"
        style={{
          display: "flex",
          justifyContent: "center",
          opacity: interpolate(frame, [0.3 * fps, 1.6 * fps], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: ease,
          }),
          scale: interpolate(frame, [0, 3 * fps], [0.97, 1.0], {
            extrapolateRight: "clamp",
          }),
        }}
      >
        {hasLogo ? (
          <Img
            src={staticFile(logoFile)}
            style={{
              width: vertical ? 640 : 620,
              height: vertical ? 300 : 260,
              objectFit: "contain",
            }}
          />
        ) : (
          <div
            style={{
              fontFamily: SERIF,
              fontWeight: 400,
              fontSize: vertical ? 150 : 170,
              letterSpacing: "0.32em",
              marginRight: "-0.32em",
              color: GOLD,
            }}
          >
            ELUORA
          </div>
        )}
      </Interactive.Div>
      <Interactive.Div
        name="Tagline"
        style={{
          marginTop: vertical ? 70 : 50,
          fontFamily: SERIF,
          fontWeight: 400,
          fontSize: vertical ? 46 : 46,
          letterSpacing: "0.14em",
          color: IVORY,
          opacity: interpolate(frame, [1.2 * fps, 2.3 * fps], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: ease,
          }),
        }}
      >
        The Christmas Ritual <span style={{ color: GOLD }}>·</span> eluora.co
      </Interactive.Div>
    </AbsoluteFill>
  );
};
