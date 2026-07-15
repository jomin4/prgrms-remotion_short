import React from "react";
import { AbsoluteFill } from "remotion";
import { theme, font } from "../theme";

// 모든 씬 공통 배경/여백. Claude docs 톤의 아이보리 페이퍼.
export const SceneFrame: React.FC<{
  children: React.ReactNode;
  opacity?: number;
  center?: boolean;
}> = ({ children, opacity = 1, center = false }) => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: theme.paper,
        fontFamily: font.sans,
        color: theme.ink,
        opacity,
      }}
    >
      <AbsoluteFill
        style={{
          padding: "200px 96px 240px 96px",
          display: "flex",
          flexDirection: "column",
          justifyContent: center ? "center" : "flex-start",
        }}
      >
        {children}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
