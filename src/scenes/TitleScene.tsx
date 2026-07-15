import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import type { TitleScene as TitleSceneType } from "../types";
import { SceneFrame } from "../components/SceneFrame";
import { fadeUp, sceneFade } from "../components/anim";
import { theme, font } from "../theme";

export const TitleScene: React.FC<TitleSceneType> = ({
  badge,
  title,
  subtitle,
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <SceneFrame opacity={sceneFade(frame, durationInFrames)} center>
      {badge && (
        <div style={{ ...fadeUp(frame, fps, 0) }}>
          <span
            style={{
              display: "inline-block",
              background: theme.clay,
              color: theme.paper,
              fontFamily: font.mono,
              fontWeight: 700,
              fontSize: 34,
              padding: "10px 26px",
              borderRadius: 10,
              letterSpacing: 2,
            }}
          >
            {badge}
          </span>
        </div>
      )}
      <h1
        style={{
          fontFamily: font.serif,
          fontSize: 116,
          fontWeight: 600,
          lineHeight: 1.12,
          letterSpacing: -1,
          margin: "40px 0 0 0",
          whiteSpace: "pre-line",
          ...fadeUp(frame, fps, 6),
        }}
      >
        {title}
      </h1>
      {subtitle && (
        <p
          style={{
            fontFamily: font.mono,
            fontSize: 44,
            color: theme.clay,
            marginTop: 40,
            ...fadeUp(frame, fps, 14),
          }}
        >
          {subtitle}
        </p>
      )}
    </SceneFrame>
  );
};
