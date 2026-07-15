import React from "react";
import { theme } from "../theme";

// 아주 가벼운 정규식 기반 토크나이저 (JS/TS/파이썬류 공통 키워드).
const KEYWORDS = new Set([
  "function", "return", "if", "else", "for", "while", "const", "let", "var",
  "def", "class", "import", "from", "new", "await", "async", "yield",
  "true", "false", "null", "None", "True", "False", "in", "of", "=>",
]);

type Tok = { text: string; color: string };

export const tokenizeLine = (line: string): Tok[] => {
  // 주석 줄 통째
  const trimmed = line.trimStart();
  if (trimmed.startsWith("//") || trimmed.startsWith("#")) {
    return [{ text: line, color: theme.code.comment }];
  }
  const out: Tok[] = [];
  // 단어 / 문자열 / 숫자 / 기호 단위로 분해
  const re = /(\"[^\"]*\"|'[^']*'|`[^`]*`|\b\d+(?:\.\d+)?\b|[A-Za-z_$][\w$]*|=>|[^\w\s])/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(line))) {
    if (m.index > last) out.push({ text: line.slice(last, m.index), color: theme.code.plain });
    const t = m[0];
    let color = theme.code.plain;
    if (/^["'`]/.test(t)) color = theme.code.string;
    else if (/^\d/.test(t)) color = theme.code.number;
    else if (KEYWORDS.has(t)) color = theme.code.keyword;
    else if (/^[A-Za-z_$][\w$]*$/.test(t)) {
      // 뒤가 '(' 이면 함수 호출로 간주
      const after = line.slice(m.index + t.length).trimStart();
      color = after.startsWith("(") ? theme.code.func : theme.code.plain;
    } else color = theme.code.punct;
    out.push({ text: t, color });
    last = m.index + t.length;
  }
  if (last < line.length) out.push({ text: line.slice(last), color: theme.code.plain });
  return out;
};

export const HighlightedLine: React.FC<{ line: string }> = ({ line }) => {
  const toks = tokenizeLine(line);
  return (
    <>
      {toks.map((t, i) => (
        <span key={i} style={{ color: t.color }}>
          {t.text}
        </span>
      ))}
    </>
  );
};
