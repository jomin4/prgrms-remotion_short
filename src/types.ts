// content/*.json 이 따르는 스키마. 새 영상은 이 형태의 JSON만 새로 작성하면 됩니다.

export type TitleScene = {
  type: "title";
  durationInFrames: number;
  badge?: string; // 상단 태그 (예: "GIT", "JS")
  title: string; // 큰 제목 (줄바꿈은 \n)
  subtitle?: string;
};

export type BulletScene = {
  type: "bullet";
  durationInFrames: number;
  heading: string;
  bullets: { icon?: string; text: string; accent?: string }[];
};

export type CompareItem = {
  label: string; // 예: "--soft"
  desc: string; // 한 줄 설명
  color?: "accent" | "green" | "orange" | "red" | "purple";
};

export type CompareScene = {
  type: "compare";
  durationInFrames: number;
  heading: string;
  items: CompareItem[];
};

export type CodeScene = {
  type: "code";
  durationInFrames: number;
  heading?: string;
  lines: string[]; // 코드 줄 배열
  caption?: string;
};

export type OutroScene = {
  type: "outro";
  durationInFrames: number;
  title: string;
  cta?: string; // 예: "구독하고 다음 편 보기"
  handle?: string;
};

// 작동 과정 흐름도 (노드 → 노드)
export type FlowScene = {
  type: "flow";
  durationInFrames: number;
  heading: string;
  nodes: { label: string; sub?: string; icon?: string }[];
};

// 번호가 매겨진 단계 설명
export type StepsScene = {
  type: "steps";
  durationInFrames: number;
  heading: string;
  steps: { title: string; desc?: string }[];
};

export type Scene =
  | TitleScene
  | BulletScene
  | CompareScene
  | CodeScene
  | OutroScene
  | FlowScene
  | StepsScene;

export type ShortContent = {
  composition?: "Explainer";
  meta: {
    youtubeTitle: string;
    youtubeDescription: string;
    tags: string[];
  };
  scenes: Scene[];
};
