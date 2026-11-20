import { Composition } from "remotion";
import { EluoraAd } from "./EluoraAd";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Eluora-Web-16x9"
        component={EluoraAd}
        durationInFrames={450}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          holdingCaseImage: "holding-case.jpg",
          lineupImage: "lineup.jpg",
          openCaseImage: "open-case.jpg",
          logoImage: "logo.png",
        }}
      />
      <Composition
        id="Eluora-Reels-9x16"
        component={EluoraAd}
        durationInFrames={450}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          holdingCaseImage: "holding-case.jpg",
          lineupImage: "lineup.jpg",
          openCaseImage: "open-case.jpg",
          logoImage: "logo.png",
        }}
      />
    </>
  );
};
