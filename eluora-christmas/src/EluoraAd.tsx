import React from "react";
import { AbsoluteFill, useVideoConfig } from "remotion";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { EndCard, HoldingCaseScene, LineupScene, OpenCaseScene } from "./Scenes";
import { Snow } from "./Snow";
import { BLACK } from "./theme";

export type EluoraAdProps = {
  holdingCaseImage: string;
  lineupImage: string;
  openCaseImage: string;
  logoImage: string;
};

export const EluoraAd: React.FC<EluoraAdProps> = ({
  holdingCaseImage,
  lineupImage,
  openCaseImage,
  logoImage,
}) => {
  const { fps } = useVideoConfig();
  // Each 0.8s crossfade is centred on the cut (4s, 8s, 12s); total stays 15s.
  return (
    <AbsoluteFill style={{ backgroundColor: BLACK }}>
      <TransitionSeries>
        <TransitionSeries.Sequence name="Holding case" durationInFrames={4.4 * fps}>
          <HoldingCaseScene file={holdingCaseImage} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 0.8 * fps })}
        />
        <TransitionSeries.Sequence name="Line-up" durationInFrames={4.8 * fps}>
          <LineupScene file={lineupImage} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 0.8 * fps })}
        />
        <TransitionSeries.Sequence name="Open case" durationInFrames={4.8 * fps}>
          <OpenCaseScene file={openCaseImage} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 0.8 * fps })}
        />
        <TransitionSeries.Sequence name="End card" durationInFrames={3.4 * fps}>
          <EndCard logoFile={logoImage} />
        </TransitionSeries.Sequence>
      </TransitionSeries>
      <Snow
        densityFrames={[0, 3.6 * fps, 4.4 * fps, 15 * fps]}
        densityValues={[1, 1, 0.45, 0.45]}
      />
    </AbsoluteFill>
  );
};
