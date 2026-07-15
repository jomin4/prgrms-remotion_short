// 템플릿 A (코드 분석) 스키마. content/code/*.json 이 이 형태를 따릅니다.

export type StackFrame = {
  label: string; // 예: "factorial(3)"
  sub?: string; // 예: "n = 3"
  returning?: string; // 반환 중이면 값 (예: "6")
};

export type Viz =
  | { type: "stack"; title?: string; frames: StackFrame[] }
  | {
      type: "vars";
      title?: string;
      vars: { name: string; value: string; changed?: boolean }[];
    }
  | {
      type: "array";
      title?: string;
      label?: string;
      values: string[];
      pointer?: number; // 강조할 인덱스 (0-based)
    }
  | {
      // 표준 2열(Stack | Heap) 박스-화살표 메모리 다이어그램
      type: "memory";
      title?: string;
      stack: {
        name: string;
        value?: string; // 원시값이면 상자 안에 직접 표시
        ref?: string; // 참조면 heap 객체의 id (화살표로 연결)
        changed?: boolean;
      }[];
      heap: {
        id: string;
        label?: string; // 예: "int[]", "Object"
        value: string; // 예: "[99]", "{ x: 99 }"
        changed?: boolean;
      }[];
    }
  | {
      // HashMap 버킷 배열 + 체이닝 다이어그램
      type: "hashmap";
      title?: string;
      capacity: number; // 버킷 개수 (0..capacity-1 렌더)
      compute?: string; // 상단 해시 계산 표시 (예: 'hash("C") & 7  →  5')
      buckets: {
        index: number;
        entries: { k: string; v: string; hot?: boolean }[];
      }[];
    }
  | { type: "note"; title?: string; lines: string[] };

export type CodeStep = {
  durationInFrames: number;
  focus: number[]; // 강조할 코드 줄 번호 (1-based)
  caption: string; // 하단 설명
  viz: Viz;
};

export type CodeAnalysisContent = {
  composition: "CodeAnalysis";
  meta: { youtubeTitle: string; youtubeDescription: string; tags: string[] };
  title: string; // 상단 개념명 (스텝 헤더에도 표시)
  filename: string; // 에디터 탭 이름
  code: string[]; // 코드 줄 배열
  // 맨 앞 오프닝(훅) 화면. 있으면 title을 크게 띄운 뒤 분석 시작.
  // caption: 진행 방식을 알리는 하단 자막(짧게, 핵심만). 화면 텍스트로 남기지 않음.
  intro?: {
    durationInFrames: number;
    badge?: string;
    subtitle?: string;
    caption?: string;
  };
  // 내레이션 스크립트 (보이스오버용). intro는 인사말로 시작.
  narration?: { intro: string; steps?: string[] };
  // scripts/tts.mjs 가 채우는 TTS 오디오 정보. 있으면 음성 길이로 타이밍을 덮어씀.
  audio?: {
    voice: string;
    dir: string; // public/ 기준 (예: "audio/hashmap")
    intro: { file: string; durationInFrames: number };
    steps: { file: string; durationInFrames: number }[];
  };
  steps: CodeStep[];
};

// 오디오가 있으면 음성 길이 기준, 없으면 작성한 durationInFrames 기준.
export const introFrames = (c: CodeAnalysisContent) =>
  c.audio?.intro.durationInFrames ?? c.intro?.durationInFrames ?? 0;

export const stepFrames = (c: CodeAnalysisContent, i: number) =>
  c.audio?.steps[i]?.durationInFrames ?? c.steps[i].durationInFrames;

export const analysisDuration = (c: CodeAnalysisContent) =>
  introFrames(c) + c.steps.reduce((s, _st, i) => s + stepFrames(c, i), 0);
