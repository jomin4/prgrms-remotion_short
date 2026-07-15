# 개발자 학습형 유튜브 쇼츠 자동화 (Remotion)

데이터(JSON)만 갈아끼우면 반복 생산되는 쇼츠 파이프라인입니다.
비주얼은 Claude docs/블로그 톤(아이보리 + 세리프 + 클레이 포인트)으로 고정,
내용은 `content/**/*.json` 하나로 교체합니다.

## 두 가지 템플릿

| 템플릿 | 컴포지션 id | 용도 | content 폴더 |
|--------|-------------|------|--------------|
| **A. 코드 분석** | `CodeAnalysis` | macOS 에디터에 코드, 한 줄씩 실행될 때 내부(콜스택/변수/배열)에서 벌어지는 일을 시각화 | `content/code/` |
| **B. 개념 설명** | `Explainer` | IT 주제의 작동 과정을 씬(흐름도·단계·비교 등) 조립으로 설명 | `content/explainer/` |

각 content JSON의 `"composition"` 필드가 어떤 템플릿으로 렌더할지 결정합니다.

```
content/code/*.json       ← 템플릿 A 콘텐츠 (title·filename·code·steps[])
content/explainer/*.json  ← 템플릿 B 콘텐츠 (scenes[])
src/CodeAnalysis.tsx      ← 템플릿 A 메인 (에디터 + 시각화 동기화)
src/Short.tsx             ← 템플릿 B 메인 (씬 시퀀스 조립)
src/scenes/               ← 재사용 씬들
scripts/render.mjs        ← composition 자동 감지 후 MP4 렌더
scripts/auth.mjs          ← YouTube OAuth 최초 1회 인증
scripts/upload.mjs        ← YouTube 자동 업로드
```

## 1. 미리보기 / 편집

```bash
npm run dev        # Remotion Studio 열기 (브라우저에서 실시간 미리보기)
```

## 2. 렌더

```bash
npm run render content/code/recursion.json       # 템플릿 A 예시
npm run render content/concept/tcp-handshake.json # 템플릿 B 예시
```

결과물: `out/<이름>.mp4` (1080×1920, 30fps)

## 2.5 보이스오버 (TTS, 템플릿 B)

`narration` 스크립트가 있는 콘텐츠는 렌더 전에 음성을 합성해 자동 동기화합니다.

```bash
npm run tts content/concept/tcp-handshake.json    # edge-tts로 세그먼트별 음성 생성
npm run render content/concept/tcp-handshake.json # 음성이 포함된 mp4
```

- 요구 사항: `python`, `pip install edge-tts`, `ffmpeg`/`ffprobe`
- `narration.intro`(인사말) + `narration.steps[]`(스텝별 대사)를 각각 합성 → `public/audio/<이름>/seg-*.mp3`
- 각 세그먼트 음성 길이에 맞춰 화면 길이가 자동 설정됨(음성·화면·자막 동기화). 결과는 `audio` 블록으로 콘텐츠에 기록됨
- 기본 음성: `ko-KR-SunHiNeural` (변경: `npm run tts <파일> ko-KR-InJoonNeural`)

## 3. 새 영상 만들기

해당 폴더에 JSON 하나만 새로 작성하면 됩니다.

### 템플릿 B (개념 설명) 씬 종류 — `content/explainer/`
| type | 용도 | 주요 필드 |
|------|------|-----------|
| `title`   | 인트로 | badge, title, subtitle |
| `bullet`  | 목록/요약 | heading, bullets[] |
| `compare` | 항목 비교 | heading, items[] (color: accent/green/orange/red/purple) |
| `code`    | 코드 블록 | heading, lines[], caption |
| `flow`    | 작동 흐름도 | heading, nodes[] (label, sub, icon) |
| `steps`   | 번호 단계 | heading, steps[] (title, desc) |
| `outro`   | 마무리/CTA | title, cta, handle |

전체 스키마: `src/types.ts`

### 템플릿 A (코드 분석) — `content/code/`
`code[]`(코드 줄)와 `steps[]`를 정의합니다. 각 step:
- `focus`: 강조할 코드 줄 번호(1-based) — 하이라이트 바가 여기로 이동
- `caption`: 하단 자막
- `viz`: 우측/하단 시각화 — `stack`(콜스택) · `vars`(변수) · `array`(배열) · `note`(설명)

전체 스키마: `src/typesAnalysis.ts`

각 씬/스텝의 `durationInFrames` 합이 전체 영상 길이입니다 (30 = 1초).

## 4. YouTube 업로드 설정 (최초 1회)

> ⚠️ 이 단계는 본인의 Google 계정 인증이 필요해 **직접** 진행해야 합니다.

1. **Google Cloud Console** (https://console.cloud.google.com) 접속 → 프로젝트 생성
2. **YouTube Data API v3** 사용 설정 (API 및 서비스 → 라이브러리)
3. **OAuth 동의 화면** 구성 → 본인 계정을 "테스트 사용자"로 추가
4. **사용자 인증 정보 → OAuth 클라이언트 ID → 데스크톱 앱** 생성
5. 발급된 client_id / client_secret 를 `.env` 에 입력:
   ```bash
   cp .env.example .env      # 후 값 채우기
   ```
6. 인증 실행:
   ```bash
   npm run auth              # 뜬 주소를 브라우저에서 열어 로그인/승인 → token.json 생성
   ```

## 5. 업로드

```bash
npm run upload content/code/recursion.json                # 기본: 비공개(private)
npm run upload content/explainer/jwt.json unlisted        # 미등록(링크공개)
npm run upload content/explainer/jwt.json public          # 전체공개
```

> 안전을 위해 기본값은 `private`. 확인 후 unlisted/public 으로 올리세요.

## 요구 사항

- Node.js 18+ (검증: v24)
- 최초 렌더 시 Remotion이 Chrome Headless Shell을 자동 다운로드합니다.
