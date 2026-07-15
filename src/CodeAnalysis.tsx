import React from "react";
import {
  AbsoluteFill,
  Audio,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
} from "remotion";
import type { CodeAnalysisContent } from "./typesAnalysis";
import { introFrames, stepFrames } from "./typesAnalysis";
import { theme, font } from "./theme";
import { EditorWindow } from "./scenes/analysis/EditorWindow";
import { Viz } from "./scenes/analysis/Viz";
import { IntroCard } from "./scenes/analysis/IntroCard";
import { Caption } from "./scenes/analysis/Caption";

export const CodeAnalysis: React.FC<CodeAnalysisContent> = (content) => {
  const { title, filename, code, intro, steps, audio } = content;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const introDur = introFrames(content);
  const inIntro = frame < introDur;
  const af = frame - introDur; // 분석 구간 프레임 (인트로 이후)

  // 인트로 페이드(인/아웃) & 본문 페이드인
  const introOpacity = interpolate(
    frame,
    [0, 8, introDur - 8, introDur],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const mainOpacity = introDur
    ? interpolate(frame, [introDur, introDur + 8], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 1;

  // 현재 스텝과 스텝 내 로컬 프레임 계산 (분석 구간 기준, 오디오 길이 반영)
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

  // 글라이딩 하이라이트: 이전 스텝 → 현재 스텝 focus 줄로 부드럽게 이동
  const prevLine = (steps[Math.max(0, idx - 1)].focus[0] ?? 1);
  const curLine = step.focus[0] ?? 1;
  const barLine = interpolate(localFrame, [0, 12], [prevLine, curLine], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.ease),
  });

  return (
    <AbsoluteFill
      style={{
        background: theme.paper,
        fontFamily: font.sans,
        color: theme.ink,
      }}
    >
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

      {/* 오프닝(훅) 화면 */}
      {intro && inIntro && (
        <IntroCard
          title={title}
          badge={intro.badge}
          subtitle={intro.subtitle}
          opacity={introOpacity}
        />
      )}

      {/* 분석 본문 */}
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
      {/* 헤더 */}
      <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 34 }}>
        <span
          style={{
            width: 14,
            height: 44,
            background: theme.clay,
            borderRadius: 6,
          }}
        />
        <span style={{ fontFamily: font.serif, fontSize: 56, fontWeight: 600 }}>
          {title}
        </span>
      </div>

      {/* 에디터 */}
      <EditorWindow filename={filename} code={code} barLine={barLine} />

      {/* 시각화 패널 */}
      <div
        style={{
          flex: 1,
          marginTop: 44,
          background: theme.paperAlt,
          border: `1px solid ${theme.border}`,
          borderRadius: 22,
          padding: "40px 44px",
          overflow: "hidden",
        }}
      >
        <Viz viz={step.viz} localFrame={localFrame} fps={fps} />
      </div>
        </div>
      )}

      {/* 하단 자막: 인트로엔 진행 방식 안내, 스텝엔 단계 설명 */}
      {inIntro
        ? intro?.caption && <Caption text={intro.caption} opacity={introOpacity} />
        : <Caption text={step.caption} opacity={mainOpacity} />}
    </AbsoluteFill>
  );
};
