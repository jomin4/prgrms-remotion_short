import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import type { BulletScene as BulletSceneType } from "../types";
import { SceneFrame } from "../components/SceneFrame";
import { fadeUp, sceneFade } from "../components/anim";
import { theme, font } from "../theme";

export const BulletScene: React.FC<BulletSceneType> = ({
  heading,
  bullets,
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <SceneFrame opacity={sceneFade(frame, durationInFrames)} center>
      <h2
        style={{
          fontFamily: font.serif,
          fontSize: 74,
          fontWeight: 600,
          margin: 0,
          ...fadeUp(frame, fps, 0),
        }}
      >
        {heading}
      </h2>
      <div style={{ marginTop: 64, display: "flex", flexDirection: "column", gap: 40 }}>
        {bullets.map((b, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 28,
              ...fadeUp(frame, fps, 10 + i * 8),
            }}
          >
            <span style={{ fontSize: 52 }}>{b.icon ?? "▹"}</span>
            <span
              style={{
                fontSize: 52,
                lineHeight: 1.35,
                color: b.accent ?? theme.inkSoft,
              }}
            >
              {b.text}
            </span>
          </div>
        ))}
      </div>
    </SceneFrame>
  );
};
