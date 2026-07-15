import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import type { StepsScene as StepsSceneType } from "../types";
import { SceneFrame } from "../components/SceneFrame";
import { fadeUp, sceneFade } from "../components/anim";
import { theme, font } from "../theme";

// 번호가 매겨진 단계 설명 (순차 등장)
export const StepsScene: React.FC<StepsSceneType> = ({
  heading,
  steps,
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <SceneFrame opacity={sceneFade(frame, durationInFrames)} center>
      <h2
        style={{
          fontFamily: font.serif,
          fontSize: 66,
          fontWeight: 600,
          margin: "0 0 52px 0",
          ...fadeUp(frame, fps, 0),
        }}
      >
        {heading}
      </h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 34 }}>
        {steps.map((s, i) => (
          <div
            key={i}
            style={{ display: "flex", alignItems: "flex-start", gap: 30, ...fadeUp(frame, fps, 10 + i * 12) }}
          >
            <span
              style={{
                flexShrink: 0,
                width: 72,
                height: 72,
                borderRadius: 999,
                background: theme.clay,
                color: theme.paper,
                fontFamily: font.mono,
                fontSize: 42,
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {i + 1}
            </span>
            <div style={{ paddingTop: 4 }}>
              <div style={{ fontSize: 50, fontWeight: 700, color: theme.ink }}>{s.title}</div>
              {s.desc && (
                <div style={{ fontSize: 42, color: theme.muted, marginTop: 10, lineHeight: 1.3 }}>
                  {s.desc}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </SceneFrame>
  );
};
