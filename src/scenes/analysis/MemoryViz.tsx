import React from "react";
import { interpolate, spring } from "remotion";
import { theme, font } from "../../theme";

// 표준 Stack | Heap 박스-화살표 메모리 다이어그램.
// 좌표를 고정 기하로 계산해 SVG 오버레이로 화살표를 그린다.

const LABEL_H = 48;
const NAME_X = 4;
const BOX_X = 48;
const BOX_W = 300;
const BOX_RIGHT = BOX_X + BOX_W; // 348
const STACK_H = 86;
const STACK_PITCH = 108;
const HEAP_X = 452;
const HEAP_W = 320;
const HEAP_H = 128;
const HEAP_PITCH = 158;

type StackItem = { name: string; value?: string; ref?: string; changed?: boolean };
type HeapItem = { id: string; label?: string; value: string; changed?: boolean };

const enter = (f: number, fps: number, delay: number) => {
  const s = spring({ frame: f - delay, fps, config: { damping: 200 }, durationInFrames: 14 });
  return {
    opacity: interpolate(s, [0, 1], [0, 1]),
    transform: `translateY(${interpolate(s, [0, 1], [14, 0])}px)`,
  };
};

export const MemoryViz: React.FC<{
  stack: StackItem[];
  heap: HeapItem[];
  localFrame: number;
  fps: number;
}> = ({ stack, heap, localFrame, fps }) => {
  const stackCenterY = (i: number) => LABEL_H + i * STACK_PITCH + STACK_H / 2;
  const heapIndex = (id: string) => heap.findIndex((h) => h.id === id);
  const heapCenterY = (j: number) => LABEL_H + j * HEAP_PITCH + HEAP_H / 2;

  const height =
    LABEL_H +
    Math.max(
      stack.length * STACK_PITCH - (STACK_PITCH - STACK_H),
      heap.length * HEAP_PITCH - (HEAP_PITCH - HEAP_H),
      HEAP_H
    );

  const arrowOpacity = interpolate(localFrame, [10, 22], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div style={{ position: "relative", height, width: HEAP_X + HEAP_W }}>
      {/* 열 라벨 */}
      <div
        style={{
          position: "absolute",
          left: NAME_X,
          top: 0,
          fontFamily: font.mono,
          fontSize: 28,
          letterSpacing: 1.5,
          color: theme.muted,
        }}
      >
        STACK
      </div>
      <div
        style={{
          position: "absolute",
          left: HEAP_X,
          top: 0,
          fontFamily: font.mono,
          fontSize: 28,
          letterSpacing: 1.5,
          color: theme.muted,
        }}
      >
        HEAP
      </div>

      {/* SVG 화살표 오버레이 */}
      <svg
        width={HEAP_X + HEAP_W}
        height={height}
        style={{ position: "absolute", left: 0, top: 0, opacity: arrowOpacity }}
      >
        <defs>
          <marker id="mv-arrow" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto">
            <path d="M0,0 L9,5 L0,10 z" fill={theme.clay} />
          </marker>
        </defs>
        {stack.map((s, i) => {
          if (!s.ref) return null;
          const j = heapIndex(s.ref);
          if (j < 0) return null;
          const y1 = stackCenterY(i);
          const y2 = heapCenterY(j);
          const x1 = BOX_RIGHT;
          const x2 = HEAP_X;
          const cx = (x1 + x2) / 2;
          return (
            <path
              key={i}
              d={`M${x1},${y1} C ${cx},${y1} ${cx},${y2} ${x2 - 4},${y2}`}
              fill="none"
              stroke={theme.clay}
              strokeWidth={3}
              markerEnd="url(#mv-arrow)"
            />
          );
        })}
      </svg>

      {/* Stack 변수 상자 */}
      {stack.map((s, i) => {
        const top = LABEL_H + i * STACK_PITCH;
        const hot = s.changed;
        return (
          <React.Fragment key={s.name}>
            <div
              style={{
                position: "absolute",
                left: NAME_X,
                top,
                height: STACK_H,
                display: "flex",
                alignItems: "center",
                fontFamily: font.mono,
                fontSize: 34,
                fontWeight: 700,
                color: theme.ink,
                ...enter(localFrame, fps, i * 3),
              }}
            >
              {s.name}
            </div>
            <div
              style={{
                position: "absolute",
                left: BOX_X,
                top,
                width: BOX_W,
                height: STACK_H,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: hot ? theme.clayL : "#FFFFFF",
                border: `2px solid ${hot ? theme.clay : theme.border}`,
                borderRadius: 12,
                ...enter(localFrame, fps, i * 3),
              }}
            >
              {s.ref ? (
                <span
                  style={{
                    position: "absolute",
                    left: 20,
                    width: 20,
                    height: 20,
                    borderRadius: 99,
                    background: theme.clay,
                  }}
                />
              ) : (
                <span
                  style={{
                    fontFamily: font.mono,
                    fontSize: 38,
                    fontWeight: 700,
                    color: theme.viz.value,
                  }}
                >
                  {s.value}
                </span>
              )}
            </div>
          </React.Fragment>
        );
      })}

      {/* Heap 객체 */}
      {heap.map((h, j) => {
        const top = LABEL_H + j * HEAP_PITCH;
        return (
          <div
            key={h.id}
            style={{
              position: "absolute",
              left: HEAP_X,
              top,
              width: HEAP_W,
              height: HEAP_H,
              background: h.changed ? theme.clayL : "#FFFFFF",
              border: `2.5px solid ${theme.clay}`,
              borderRadius: 14,
              padding: "18px 24px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: 10,
              ...enter(localFrame, fps, 6 + j * 3),
            }}
          >
            {h.label && (
              <span style={{ fontFamily: font.mono, fontSize: 26, color: theme.muted }}>
                {h.label}
              </span>
            )}
            <span style={{ fontFamily: font.mono, fontSize: 40, fontWeight: 700, color: theme.ink }}>
              {h.value}
            </span>
          </div>
        );
      })}
    </div>
  );
};
