// 템플릿 B (개념 설명, 시각화 우선) 스키마. content/concept/*.json 이 따름.
// 원칙: 화면 텍스트 최소화 + 시각화 위주, 설명은 하단 자막(caption).

export type SequenceViz = {
  type: "sequence";
  actors: {
    a: { label: string; sub?: string };
    b: { label: string; sub?: string };
  };
  slots?: number; // 예약할 메시지 행 수 (라이프라인 길이 안정화)
  messages: {
    from: "a" | "b";
    label: string; // 예: "SYN"
    note?: string; // 예: "seq=x"
    hot?: boolean; // 이번 스텝에 새로 등장한 메시지
  }[];
  stateA?: string; // 왼쪽 액터 현재 상태 (예: "SYN_SENT")
  stateB?: string; // 오른쪽 액터 현재 상태
};

export type ConceptViz = SequenceViz; // 추후 flow/layers 등 추가 예정

export type ConceptStep = {
  durationInFrames: number;
  caption: string; // 하단 자막 (핵심만, 짧게)
  viz: ConceptViz;
};

export type ConceptContent = {
  composition: "Concept";
  meta: { youtubeTitle: string; youtubeDescription: string; tags: string[] };
  title: string; // 상단 작은 라벨 + 인트로 훅 제목
  intro?: { durationInFrames: number; badge?: string; caption?: string };
  // 내레이션 스크립트 (보이스오버/TTS용). 주제 이름에 맞춰 작성.
  // intro는 인사말로 시작 (예: "안녕하세요! 오늘은 ~ 알아볼게요").
  // steps[i]는 steps[i] 화면과 1:1 대응.
  narration?: { intro: string; steps?: string[] };
  steps: ConceptStep[];
};

export const conceptDuration = (c: ConceptContent) =>
  (c.intro?.durationInFrames ?? 0) +
  c.steps.reduce((s, st) => s + st.durationInFrames, 0);
