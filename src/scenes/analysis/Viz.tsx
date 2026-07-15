import React from "react";
import { interpolate, spring } from "remotion";
import type { Viz as VizType } from "../../typesAnalysis";
import { theme, font } from "../../theme";
import { MemoryViz } from "./MemoryViz";
import { HashMapViz } from "./HashMapViz";

const enter = (localFrame: number, fps: number, delay: number) => {
  const s = spring({
    frame: localFrame - delay,
    fps,
    config: { damping: 200 },
    durationInFrames: 14,
  });
  return {
    opacity: interpolate(s, [0, 1], [0, 1]),
    transform: `translateY(${interpolate(s, [0, 1], [16, 0])}px) scale(${interpolate(s, [0, 1], [0.96, 1])})`,
  };
};

const Title: React.FC<{ children?: React.ReactNode }> = ({ children }) =>
  children ? (
    <div
      style={{
        fontFamily: font.mono,
        fontSize: 30,
        letterSpacing: 1,
        color: theme.muted,
        textTransform: "uppercase",
        marginBottom: 22,
      }}
    >
      {children}
    </div>
  ) : null;

export const Viz: React.FC<{ viz: VizType; localFrame: number; fps: number }> = ({
  viz,
  localFrame,
  fps,
}) => {
  // ── 콜 스택 ──
  if (viz.type === "stack") {
    const frames = [...viz.frames].reverse(); // 최신 프레임을 위로
    return (
      <div>
        <Title>{viz.title ?? "Call Stack"}</Title>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {frames.map((f, i) => {
            const isTop = i === 0;
            const ret = f.returning != null;
            return (
              <div
                key={frames.length - i}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  background: ret ? "#EEF3E9" : isTop ? theme.clayL : "#FFFFFF",
                  border: `2px solid ${ret ? theme.viz.ret : isTop ? theme.clay : theme.border}`,
                  borderRadius: 14,
                  padding: "22px 30px",
                  ...enter(localFrame, fps, i === 0 ? 0 : 4),
                }}
              >
                <span style={{ fontFamily: font.mono, fontSize: 40, color: theme.ink }}>
                  {f.label}
                </span>
                <span style={{ fontFamily: font.mono, fontSize: 36 }}>
                  {ret ? (
                    <span style={{ color: theme.viz.ret }}>↩ {f.returning}</span>
                  ) : (
                    <span style={{ color: theme.viz.value }}>{f.sub}</span>
                  )}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ── 변수 상태 ──
  if (viz.type === "vars") {
    return (
      <div>
        <Title>{viz.title ?? "Variables"}</Title>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 18 }}>
          {viz.vars.map((v, i) => (
            <div
              key={v.name}
              style={{
                background: v.changed ? theme.clayL : "#FFFFFF",
                border: `2px solid ${v.changed ? theme.clay : theme.border}`,
                borderRadius: 14,
                padding: "20px 28px",
                ...enter(localFrame, fps, i * 3),
              }}
            >
              <span style={{ fontFamily: font.mono, fontSize: 36, color: theme.muted }}>
                {v.name} ={" "}
              </span>
              <span style={{ fontFamily: font.mono, fontSize: 40, color: theme.viz.value, fontWeight: 700 }}>
                {v.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── 배열 ──
  if (viz.type === "array") {
    return (
      <div>
        <Title>{viz.title ?? viz.label ?? "Array"}</Title>
        <div style={{ display: "flex", gap: 12 }}>
          {viz.values.map((val, i) => {
            const on = viz.pointer === i;
            return (
              <div key={i} style={{ textAlign: "center", ...enter(localFrame, fps, i * 2) }}>
                <div
                  style={{
                    width: 96,
                    height: 96,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: on ? theme.clayL : "#FFFFFF",
                    border: `2px solid ${on ? theme.clay : theme.border}`,
                    borderRadius: 12,
                    fontFamily: font.mono,
                    fontSize: 42,
                    color: theme.ink,
                  }}
                >
                  {val}
                </div>
                <div style={{ fontFamily: font.mono, fontSize: 26, color: theme.muted, marginTop: 8 }}>
                  {i}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ── 메모리 다이어그램 (Stack | Heap) ──
  if (viz.type === "memory") {
    return (
      <div>
        <Title>{viz.title ?? "Memory"}</Title>
        <MemoryViz stack={viz.stack} heap={viz.heap} localFrame={localFrame} fps={fps} />
      </div>
    );
  }

  // ── HashMap 버킷 다이어그램 ──
  if (viz.type === "hashmap") {
    return (
      <div>
        <Title>{viz.title ?? "HashMap"}</Title>
        <HashMapViz
          capacity={viz.capacity}
          compute={viz.compute}
          buckets={viz.buckets}
          localFrame={localFrame}
          fps={fps}
        />
      </div>
    );
  }

  // ── 추상 설명 노트 ──
  return (
    <div>
      <Title>{viz.title ?? "What happens"}</Title>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {viz.lines.map((l, i) => (
          <div
            key={i}
            style={{
              fontSize: 42,
              lineHeight: 1.35,
              color: theme.inkSoft,
              ...enter(localFrame, fps, i * 4),
            }}
          >
            {l}
          </div>
        ))}
      </div>
    </div>
  );
};
