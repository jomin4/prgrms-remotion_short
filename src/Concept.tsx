import React from "react";
import {
  AbsoluteFill,
  Audio,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
} from "remotion";
import type { ConceptContent, ConceptViz } from "./typesConcept";
import { introFrames, stepFrames } from "./typesConcept";
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

// 템플릿 B: 화면은 시각화 위주, 상단 작은 라벨 + 하단 자막. 타이밍은 TTS 오디오 길이 기준.
export const Concept: React.FC<ConceptContent> = (content) => {
  const { title, intro, steps, audio } = content;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const introDur = introFrames(content);
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

  // 현재 스텝 (오디오 길이 반영)
  let acc = 0;
  let idx = 0;
  for (let i = 0; i < steps.length; i++) {
    const d = stepFrames(content, i);
    if (af < acc + d) {
      idx = i;
      break;
    }
    acc += d;
    idx = i;
  }
  const step = steps[idx];
  const localFrame = af - acc;

  // 오디오 세그먼트 오프셋
  const stepOffset = (i: number) => {
    let o = introDur;
    for (let j = 0; j < i; j++) o += stepFrames(content, j);
    return o;
  };

  return (
    <AbsoluteFill style={{ background: theme.paper, fontFamily: font.sans, color: theme.ink }}>
      {/* 내레이션 오디오 */}
      {audio && (
        <>
          {intro && (
            <Sequence from={0} durationInFrames={introDur}>
              <Audio src={staticFile(`${audio.dir}/${audio.intro.file}`)} />
            </Sequence>
          )}
          {steps.map((_, i) =>
            audio.steps[i] ? (
              <Sequence key={i} from={stepOffset(i)} durationInFrames={stepFrames(content, i)}>
                <Audio src={staticFile(`${audio.dir}/${audio.steps[i].file}`)} />
              </Sequence>
            ) : null
          )}
        </>
      )}

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
          <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 10 }}>
            <span style={{ width: 12, height: 40, background: theme.clay, borderRadius: 6 }} />
            <span style={{ fontFamily: font.serif, fontSize: 50, fontWeight: 600 }}>{title}</span>
          </div>
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
            {renderViz(step.viz, localFrame, fps)}
          </div>
        </div>
      )}

      {inIntro
        ? intro?.caption && <Caption text={intro.caption} opacity={introOpacity} />
        : <Caption text={step.caption} opacity={mainOpacity} />}
    </AbsoluteFill>
  );
};
