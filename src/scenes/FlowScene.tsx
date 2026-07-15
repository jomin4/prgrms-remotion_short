import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import type { FlowScene as FlowSceneType } from "../types";
import { SceneFrame } from "../components/SceneFrame";
import { fadeUp, sceneFade } from "../components/anim";
import { theme, font } from "../theme";

// 작동 과정 흐름도: 노드가 위→아래로 순차 등장, 화살표로 연결
export const FlowScene: React.FC<FlowSceneType> = ({
  heading,
  nodes,
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
          margin: "0 0 50px 0",
          ...fadeUp(frame, fps, 0),
        }}
      >
        {heading}
      </h2>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "stretch", gap: 0 }}>
        {nodes.map((n, i) => {
          const delay = 10 + i * 14;
          const arrowP = spring({ frame: frame - (delay + 8), fps, durationInFrames: 10, config: { damping: 200 } });
          return (
            <React.Fragment key={i}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 26,
                  background: "#FFFFFF",
                  border: `1px solid ${theme.border}`,
                  borderRadius: 18,
                  padding: "30px 36px",
                  boxShadow: "0 8px 26px rgba(20,20,19,0.05)",
                  ...fadeUp(frame, fps, delay),
                }}
              >
                {n.icon && <span style={{ fontSize: 54 }}>{n.icon}</span>}
                <div>
                  <div style={{ fontSize: 50, fontWeight: 700, color: theme.ink }}>{n.label}</div>
                  {n.sub && (
                    <div style={{ fontSize: 38, color: theme.muted, marginTop: 6 }}>{n.sub}</div>
                  )}
                </div>
              </div>
              {i < nodes.length - 1 && (
                <div
                  style={{
                    alignSelf: "center",
                    fontSize: 48,
                    color: theme.clay,
                    height: 60,
                    lineHeight: "60px",
                    opacity: interpolate(arrowP, [0, 1], [0, 1]),
                  }}
                >
                  ↓
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </SceneFrame>
  );
};
