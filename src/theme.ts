import { loadFont as loadSerif } from "@remotion/google-fonts/Newsreader";
import { loadFont as loadSans } from "@remotion/google-fonts/Inter";
import { loadFont as loadMono } from "@remotion/google-fonts/JetBrainsMono";

// Claude docs / Anthropic 블로그 톤: 따뜻한 아이보리 + 세리프 헤딩 + 클레이 포인트
const serif = loadSerif("normal", { weights: ["500", "600"] });
const sans = loadSans("normal", { weights: ["400", "500", "600", "700"] });
const mono = loadMono("normal", { weights: ["400", "500", "700"] });

export const font = {
  serif: serif.fontFamily, // 에디토리얼 헤딩
  sans: sans.fontFamily, // 본문/UI
  mono: mono.fontFamily, // 코드
};

export const theme = {
  paper: "#FAF9F5", // 따뜻한 오프화이트 배경
  paperAlt: "#F0EEE6", // 카드/아이보리
  ink: "#141413", // 따뜻한 먹색
  inkSoft: "#3D3D3A",
  muted: "#73726C", // 보조 텍스트
  clay: "#C15F3C", // 시그니처 포인트 (테라코타)
  clayL: "#EBD9D0", // 연한 클레이 (하이라이트 배경)
  border: "#E3DFD5",
  // 라이트 에디터 문법 강조 (아이보리 위에서 조화되는 따뜻한 톤)
  code: {
    keyword: "#B0472B", // if/return/function
    func: "#2F6E8F", // 함수명
    string: "#5E7A3A", // 문자열
    number: "#8A5A2B", // 숫자/상수
    comment: "#A8A398", // 주석
    punct: "#57564F", // 괄호/기호
    plain: "#141413",
  },
  // 시각화 의미색
  viz: {
    active: "#C15F3C",
    value: "#2F6E8F",
    ret: "#5E7A3A",
    cellBg: "#FFFFFF",
  },
} as const;

export const VIDEO = {
  width: 1080,
  height: 1920,
  fps: 30,
} as const;
