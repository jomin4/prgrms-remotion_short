import React from "react";
import { theme, font } from "../../theme";
import { HighlightedLine } from "../../components/highlight";

export const CODE_LINE_H = 70;
const BODY_PAD_TOP = 28;

// macOS 스타일 코드 에디터 창 + 현재 실행 줄을 가리키는 글라이딩 하이라이트 바
export const EditorWindow: React.FC<{
  filename: string;
  code: string[];
  barLine: number; // 1-based, 소수 가능(줄 사이 이동 애니메이션)
}> = ({ filename, code, barLine }) => {
  // 가장 긴 줄이 잘리지 않도록 폰트 크기를 자동 축소 (JetBrains Mono ≈ 0.6em/char)
  const maxLen = Math.max(1, ...code.map((l) => l.length));
  const AVAIL = 820; // 줄번호 거터 제외한 텍스트 영역 폭(px)
  const fontSize = Math.max(26, Math.min(40, Math.floor(AVAIL / (0.6 * maxLen))));

  return (
    <div
      style={{
        background: "#FFFFFF",
        borderRadius: 22,
        border: `1px solid ${theme.border}`,
        boxShadow: "0 20px 60px rgba(20,20,19,0.08)",
        overflow: "hidden",
      }}
    >
      {/* 타이틀바 */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          padding: "22px 28px",
          background: theme.paperAlt,
          borderBottom: `1px solid ${theme.border}`,
        }}
      >
        {["#ED6A5E", "#F4BF4F", "#61C554"].map((c) => (
          <span key={c} style={{ width: 22, height: 22, borderRadius: 99, background: c }} />
        ))}
        <span
          style={{
            marginLeft: 12,
            fontFamily: font.mono,
            fontSize: 32,
            color: theme.muted,
          }}
        >
          {filename}
        </span>
      </div>

      {/* 코드 본문 */}
      <div style={{ position: "relative", padding: `${BODY_PAD_TOP}px 12px 28px 12px` }}>
        {/* 글라이딩 하이라이트 바 */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: BODY_PAD_TOP + (barLine - 1) * CODE_LINE_H,
            height: CODE_LINE_H,
            background: theme.clayL,
            borderLeft: `6px solid ${theme.clay}`,
          }}
        />
        {code.map((line, i) => (
          <div
            key={i}
            style={{
              position: "relative",
              display: "flex",
              height: CODE_LINE_H,
              alignItems: "center",
              fontFamily: font.mono,
              fontSize,
              lineHeight: 1,
              fontVariantLigatures: "none", // === 가 합쳐지지 않도록
            }}
          >
            <span
              style={{
                width: 74,
                textAlign: "right",
                paddingRight: 26,
                color: theme.code.comment,
                flexShrink: 0,
              }}
            >
              {i + 1}
            </span>
            <span style={{ whiteSpace: "pre" }}>
              <HighlightedLine line={line} />
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
