import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { theme, font } from "../../theme";
import { fadeUp } from "../../components/anim";

// 코드 분석 쇼츠의 오프닝(훅) 화면. 제목을 크게 띄워 스크롤을 멈추게 한다.
export const IntroCard: React.FC<{
  title: string;
  badge?: string;
  subtitle?: string;
  opacity: number;
}> = ({ title, badge, subtitle, opacity }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        padding: "0 96px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        opacity,
      }}
    >
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
          fontSize: 108,
          fontWeight: 600,
          lineHeight: 1.14,
          letterSpacing: -1,
          margin: "38px 0 0 0",
          whiteSpace: "pre-line",
          ...fadeUp(frame, fps, 6),
        }}
      >
        {title}
      </h1>
      <div
        style={{
          width: 120,
          height: 10,
          background: theme.clay,
          borderRadius: 6,
          margin: "44px 0 0 0",
          ...fadeUp(frame, fps, 12),
        }}
      />
      {subtitle && (
        <p
          style={{
            fontFamily: font.mono,
            fontSize: 42,
            color: theme.muted,
            marginTop: 36,
            ...fadeUp(frame, fps, 16),
          }}
        >
          {subtitle}
        </p>
      )}
    </AbsoluteFill>
  );
};
