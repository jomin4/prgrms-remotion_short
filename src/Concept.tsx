import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import type { ConceptContent, ConceptViz } from "./typesConcept";
import { theme, font } from "./theme";
import { IntroCard } from "./scenes/analysis/IntroCard";
import { Caption } from "./scenes/analysis/Caption";
import { SequenceViz } from "./scenes/concept/SequenceViz";

const renderViz = (viz: ConceptViz, localFrame: number, fps: number) => {
  switch (viz.type) {
    case "sequence":
      return <SequenceViz viz={viz} localFrame={localFrame} fps={fps} />;
  }
};

// 템플릿 B: 화면은 시각화 위주, 상단 작은 라벨 + 하단 자막으로만 텍스트.
export const Concept: React.FC<ConceptContent> = ({ title, intro, steps }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const introDur = intro?.durationInFrames ?? 0;
  const inIntro = frame < introDur;
  const af = frame - introDur;

  const introOpacity = interpolate(frame, [0, 8, introDur - 8, introDur], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const mainOpacity = introDur
    ? interpolate(frame, [introDur, introDur + 8], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 1;

  let acc = 0;
  let idx = 0;
  for (let i = 0; i < steps.length; i++) {
    if (af < acc + steps[i].durationInFrames) {
      idx = i;
      break;
    }
    acc += steps[i].durationInFrames;
    idx = i;
  }
  const step = steps[idx];
  const localFrame = af - acc;

  return (
    <AbsoluteFill style={{ background: theme.paper, fontFamily: font.sans, color: theme.ink }}>
      {intro && inIntro && (
        <IntroCard title={title} badge={intro.badge} opacity={introOpacity} />
      )}

      {!inIntro && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            padding: "150px 72px 210px 72px",
            display: "flex",
            flexDirection: "column",
            opacity: mainOpacity,
          }}
        >
          {/* 상단 작은 라벨 (무슨 시각화인지 구별용) */}
          <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 10 }}>
            <span style={{ width: 12, height: 40, background: theme.clay, borderRadius: 6 }} />
            <span style={{ fontFamily: font.serif, fontSize: 50, fontWeight: 600 }}>{title}</span>
          </div>

          {/* 시각화 (화면 대부분) */}
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
            {renderViz(step.viz, localFrame, fps)}
          </div>
        </div>
      )}

      {/* 하단 자막 */}
      {inIntro
        ? intro?.caption && <Caption text={intro.caption} opacity={introOpacity} />
        : <Caption text={step.caption} opacity={mainOpacity} />}
    </AbsoluteFill>
  );
};
