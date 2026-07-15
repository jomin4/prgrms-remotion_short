import React from "react";
import { interpolate } from "remotion";
import type { SequenceViz as SequenceVizType } from "../../typesConcept";
import { theme, font } from "../../theme";

// 시퀀스 다이어그램: 두 라이프라인(a 왼쪽, b 오른쪽) + 메시지 화살표(시간 아래로).
const XA = 210;
const XB = 730;
const MID = (XA + XB) / 2;
const HEAD_W = 300;
const MSG_TOP = 250;
const MSG_GAP = 122;

export const SequenceViz: React.FC<{
  viz: SequenceVizType;
  localFrame: number;
  fps: number;
}> = ({ viz, localFrame, fps }) => {
  const slots = viz.slots ?? Math.max(viz.messages.length, 3);
  const H = MSG_TOP + slots * MSG_GAP + 24;
  const lifeBottom = H - 20;

  const Head: React.FC<{ x: number; label: string; sub?: string; state?: string }> = ({
    x,
    label,
    sub,
    state,
  }) => (
    <>
      <rect
        x={x - HEAD_W / 2}
        y={6}
        width={HEAD_W}
        height={86}
        rx={16}
        fill="#FFFFFF"
        stroke={theme.border}
        strokeWidth={2}
      />
      <text
        x={x}
        y={sub ? 46 : 56}
        textAnchor="middle"
        fontFamily={font.sans}
        fontSize={40}
        fontWeight={700}
        fill={theme.ink}
      >
        {label}
      </text>
      {sub && (
        <text x={x} y={78} textAnchor="middle" fontFamily={font.sans} fontSize={26} fill={theme.muted}>
          {sub}
        </text>
      )}
      {/* 상태 배지 */}
      {state && (
        <>
          <rect
            x={x - (state.length * 12 + 30) / 2}
            y={104}
            width={state.length * 12 + 30}
            height={44}
            rx={10}
            fill={theme.clayL}
          />
          <text
            x={x}
            y={133}
            textAnchor="middle"
            fontFamily={font.mono}
            fontSize={26}
            fontWeight={700}
            fill={theme.clay}
          >
            {state}
          </text>
        </>
      )}
    </>
  );

  return (
    <svg
      viewBox={`0 0 940 ${H}`}
      style={{ width: "100%", height: "100%" }}
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <marker id="sq-r" markerWidth="12" markerHeight="12" refX="9" refY="5" orient="auto">
          <path d="M0,0 L10,5 L0,10 z" fill={theme.clay} />
        </marker>
        <marker id="sq-r-dim" markerWidth="12" markerHeight="12" refX="9" refY="5" orient="auto">
          <path d="M0,0 L10,5 L0,10 z" fill="#A8A39A" />
        </marker>
      </defs>

      {/* 라이프라인 */}
      <line x1={XA} y1={160} x2={XA} y2={lifeBottom} stroke={theme.border} strokeWidth={3} strokeDasharray="6 10" />
      <line x1={XB} y1={160} x2={XB} y2={lifeBottom} stroke={theme.border} strokeWidth={3} strokeDasharray="6 10" />

      {/* 메시지 화살표 */}
      {viz.messages.map((m, i) => {
        const y = MSG_TOP + i * MSG_GAP;
        const rightward = m.from === "a";
        const x1 = rightward ? XA : XB;
        const x2 = rightward ? XB : XA;
        const hot = m.hot;
        const color = hot ? theme.clay : "#8B8880";
        const opacity = hot ? interpolate(localFrame, [0, 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 1;
        return (
          <g key={i} opacity={opacity}>
            <text
              x={MID}
              y={y - 18}
              textAnchor="middle"
              fontFamily={font.mono}
              fontSize={38}
              fontWeight={700}
              fill={color}
            >
              {m.label}
            </text>
            <line
              x1={x1}
              y1={y}
              x2={x2}
              y2={y}
              stroke={color}
              strokeWidth={hot ? 5 : 3}
              markerEnd={hot ? "url(#sq-r)" : "url(#sq-r-dim)"}
            />
            {m.note && (
              <text x={MID} y={y + 34} textAnchor="middle" fontFamily={font.mono} fontSize={26} fill={theme.muted}>
                {m.note}
              </text>
            )}
          </g>
        );
      })}

      <Head x={XA} label={viz.actors.a.label} sub={viz.actors.a.sub} state={viz.stateA} />
      <Head x={XB} label={viz.actors.b.label} sub={viz.actors.b.sub} state={viz.stateB} />
    </svg>
  );
};
