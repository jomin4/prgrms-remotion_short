import React from "react";
import { interpolate, spring } from "remotion";
import { theme, font } from "../../theme";

// HashMap 버킷 배열 + 체이닝. 각 버킷을 한 행으로: [index] → [node] → [node] ...
type Entry = { k: string; v: string; hot?: boolean };
type Bucket = { index: number; entries: Entry[] };

const ROW_H = 66;

const enter = (f: number, fps: number, delay: number) => {
  const s = spring({ frame: f - delay, fps, config: { damping: 200 }, durationInFrames: 16 });
  return {
    opacity: interpolate(s, [0, 1], [0, 1]),
    transform: `translateX(${interpolate(s, [0, 1], [18, 0])}px)`,
  };
};

const EntryNode: React.FC<{ e: Entry }> = ({ e }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      height: 56,
      padding: "0 22px",
      background: e.hot ? theme.clayL : "#FFFFFF",
      border: `2px solid ${e.hot ? theme.clay : theme.border}`,
      borderRadius: 12,
      fontFamily: font.mono,
      fontSize: 32,
      fontWeight: 700,
      color: theme.ink,
      whiteSpace: "nowrap",
    }}
  >
    <span style={{ color: theme.code.string }}>"{e.k}"</span>
    <span style={{ color: theme.muted, margin: "0 4px" }}>=</span>
    <span style={{ color: theme.viz.value }}>{e.v}</span>
  </div>
);

export const HashMapViz: React.FC<{
  capacity: number;
  compute?: string;
  buckets: Bucket[];
  localFrame: number;
  fps: number;
}> = ({ capacity, compute, buckets, localFrame, fps }) => {
  const byIndex = (i: number) => buckets.find((b) => b.index === i);

  return (
    <div>
      {/* 해시 계산 표시 */}
      {compute && (
        <div
          style={{
            display: "inline-block",
            fontFamily: font.mono,
            fontSize: 32,
            color: theme.ink,
            background: "#FFFFFF",
            border: `2px solid ${theme.clay}`,
            borderRadius: 12,
            padding: "12px 22px",
            marginBottom: 24,
            ...enter(localFrame, fps, 0),
          }}
        >
          {compute}
        </div>
      )}

      {/* 버킷 배열 */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {Array.from({ length: capacity }).map((_, i) => {
          const b = byIndex(i);
          const entries = b?.entries ?? [];
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", height: ROW_H, gap: 0 }}>
              {/* 인덱스 칸 */}
              <div
                style={{
                  width: 60,
                  height: 56,
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: theme.paperAlt,
                  border: `2px solid ${theme.border}`,
                  borderRadius: 10,
                  fontFamily: font.mono,
                  fontSize: 30,
                  color: theme.muted,
                }}
              >
                {i}
              </div>

              {entries.length === 0 ? (
                <span style={{ marginLeft: 24, fontFamily: font.mono, fontSize: 28, color: "#C9C4B8" }}>
                  null
                </span>
              ) : (
                <div style={{ display: "flex", alignItems: "center", ...enter(localFrame, fps, 4 + i) }}>
                  <span style={{ color: theme.clay, fontSize: 30, margin: "0 14px" }}>→</span>
                  {entries.map((e, k) => (
                    <React.Fragment key={k}>
                      <EntryNode e={e} />
                      {k < entries.length - 1 && (
                        <span style={{ color: theme.clay, fontSize: 30, margin: "0 12px" }}>→</span>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
