import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import type { CompareScene as CompareSceneType } from "../types";
import { SceneFrame } from "../components/SceneFrame";
import { fadeUp, sceneFade } from "../components/anim";
import { theme, font } from "../theme";

const colorMap = {
  accent: theme.clay,
  green: "#5E7A3A",
  orange: "#8A5A2B",
  red: "#B0472B",
  purple: "#6D5AA6",
} as const;

export const CompareScene: React.FC<CompareSceneType> = ({
  heading,
  items,
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <SceneFrame opacity={sceneFade(frame, durationInFrames)} center>
      <h2
        style={{
          fontFamily: font.serif,
          fontSize: 68,
          fontWeight: 600,
          margin: "0 0 52px 0",
          ...fadeUp(frame, fps, 0),
        }}
      >
        {heading}
      </h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 30 }}>
        {items.map((it, i) => {
          const c = colorMap[it.color ?? "accent"];
          return (
            <div
              key={i}
              style={{
                background: "#FFFFFF",
                border: `1px solid ${theme.border}`,
                borderLeft: `10px solid ${c}`,
                borderRadius: 18,
                padding: "34px 40px",
                boxShadow: "0 8px 30px rgba(20,20,19,0.04)",
                ...fadeUp(frame, fps, 8 + i * 10),
              }}
            >
              <div style={{ fontFamily: font.mono, fontSize: 50, fontWeight: 700, color: c }}>
                {it.label}
              </div>
              <div style={{ fontSize: 44, color: theme.inkSoft, marginTop: 14, lineHeight: 1.3 }}>
                {it.desc}
              </div>
            </div>
          );
        })}
      </div>
    </SceneFrame>
  );
};
