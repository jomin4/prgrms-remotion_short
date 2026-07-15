import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import type { OutroScene as OutroSceneType } from "../types";
import { SceneFrame } from "../components/SceneFrame";
import { fadeUp, sceneFade } from "../components/anim";
import { theme, font } from "../theme";

export const OutroScene: React.FC<OutroSceneType> = ({
  title,
  cta,
  handle,
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pulse = 1 + 0.035 * Math.sin((frame / fps) * 6);

  return (
    <SceneFrame opacity={sceneFade(frame, durationInFrames)} center>
      <div style={{ textAlign: "center" }}>
        <h1
          style={{
            fontFamily: font.serif,
            fontSize: 96,
            fontWeight: 600,
            margin: 0,
            ...fadeUp(frame, fps, 0),
          }}
        >
          {title}
        </h1>
        {cta && (
          <div
            style={{
              display: "inline-block",
              marginTop: 60,
              background: theme.clay,
              color: theme.paper,
              fontSize: 50,
              fontWeight: 700,
              padding: "26px 54px",
              borderRadius: 999,
              transform: `scale(${pulse})`,
              opacity: interpolate(frame, [10, 25], [0, 1], { extrapolateRight: "clamp" }),
            }}
          >
            ▶ {cta}
          </div>
        )}
        {handle && (
          <p style={{ fontSize: 44, color: theme.muted, marginTop: 50, ...fadeUp(frame, fps, 20) }}>
            {handle}
          </p>
        )}
      </div>
    </SceneFrame>
  );
};
