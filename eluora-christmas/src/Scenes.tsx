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
const Photo: React.FC<{ file: string; style: React.CSSProperties }> = ({
  file,
  style,
}) => {
  if (!fileExists(file)) {
    return (
      <AbsoluteFill
        style={{
          backgroundColor: "#141210",
          justifyContent: "center",
          alignItems: "center",
          color: "rgba(201,164,92,0.6)",
          fontFamily: "monospace",
          fontSize: 28,
        }}
      >
        missing public/{file}
      </AbsoluteFill>
    );
  }
  return (
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
  );
};

// Darkened edges + bottom gradient so the ivory headline always reads.
const Grade: React.FC = () => (
  <AbsoluteFill
    style={{
      background:
        "radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.55) 100%), linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0) 30%, rgba(0,0,0,0) 50%, rgba(0,0,0,0.75) 100%)",
    }}
  />
);

export const Headline: React.FC<{ text: string; delay: number }> = ({
  text,
  delay,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const vertical = height > width;
  return (
    <AbsoluteFill
      style={{
        justifyContent: "flex-end",
        alignItems: "center",
        paddingBottom: vertical ? 340 : 130,
        paddingLeft: vertical ? 90 : 160,
        paddingRight: vertical ? 90 : 160,
      }}
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
          fontSize: vertical ? 96 : 92,
          lineHeight: 1.12,
          letterSpacing: "0.02em",
          color: IVORY,
          textAlign: "center",
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
  const { durationInFrames } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: BLACK, overflow: "hidden" }}>
      <Photo
        file={file}
        style={{
          scale: interpolate(frame, [0, durationInFrames], [1.0, 1.12], {
            extrapolateRight: "clamp",
          }),
          transformOrigin: "50% 45%",
        }}
      />
      <Grade />
      <Headline text="The Art of Coming Home" delay={18} />
    </AbsoluteFill>
  );
};

// 4–8s: product line-up, slow pan left → right with warm gold glow
export const LineupScene: React.FC<{ file: string }> = ({ file }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: BLACK, overflow: "hidden" }}>
      <Photo
        file={file}
        style={{
          scale: 1.16,
          translate: interpolate(
            frame,
            [0, durationInFrames],
            ["6.5% 0%", "-6.5% 0%"],
            { extrapolateRight: "clamp" },
          ),
        }}
      />
      <AbsoluteFill
        style={{
          mixBlendMode: "screen",
          background:
            "radial-gradient(ellipse 60% 55% at 50% 42%, rgba(201,164,92,0.45) 0%, rgba(201,164,92,0.12) 45%, rgba(201,164,92,0) 75%)",
          opacity: interpolate(
            frame,
            [0, durationInFrames * 0.5, durationInFrames],
            [0.35, 0.8, 0.55],
          ),
          translate: interpolate(
            frame,
            [0, durationInFrames],
            ["-12% 0%", "12% 0%"],
          ),
        }}
      />
      <Grade />
      <Headline text="Six rituals from the Estonian bog" delay={22} />
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
        style={{
          scale: interpolate(frame, [0, durationInFrames], [1.04, 1.2], {
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.4, 0, 0.6, 1),
          }),
          transformOrigin: "50% 55%",
        }}
      />
      <Grade />
      <Headline text="A little luxury. A moment for yourself." delay={22} />
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
