import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import type { CodeScene as CodeSceneType } from "../types";
import { SceneFrame } from "../components/SceneFrame";
import { fadeUp, sceneFade } from "../components/anim";
import { theme, font } from "../theme";
import { HighlightedLine } from "../components/highlight";

export const CodeScene: React.FC<CodeSceneType> = ({
  heading,
  lines,
  caption,
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <SceneFrame opacity={sceneFade(frame, durationInFrames)} center>
      {heading && (
        <h2
          style={{
            fontFamily: font.serif,
            fontSize: 64,
            fontWeight: 600,
            margin: "0 0 40px 0",
            ...fadeUp(frame, fps, 0),
          }}
        >
          {heading}
        </h2>
      )}
      <div
        style={{
          background: "#FFFFFF",
          border: `1px solid ${theme.border}`,
          borderRadius: 20,
          padding: "40px 44px",
          boxShadow: "0 14px 40px rgba(20,20,19,0.06)",
          ...fadeUp(frame, fps, 8),
        }}
      >
        <div style={{ display: "flex", gap: 14, marginBottom: 30 }}>
          {["#ED6A5E", "#F4BF4F", "#61C554"].map((c) => (
            <span key={c} style={{ width: 22, height: 22, borderRadius: 99, background: c }} />
          ))}
        </div>
        {lines.map((l, i) => (
          <div
            key={i}
            style={{
              fontFamily: font.mono,
              fontSize: 44,
              lineHeight: 1.7,
              whiteSpace: "pre-wrap",
              fontVariantLigatures: "none",
              ...fadeUp(frame, fps, 16 + i * 6),
            }}
          >
            <HighlightedLine line={l} />
          </div>
        ))}
      </div>
      {caption && (
        <p style={{ fontSize: 42, color: theme.muted, marginTop: 40, ...fadeUp(frame, fps, 20) }}>
          {caption}
        </p>
      )}
    </SceneFrame>
  );
};
