# 리서치: 이미지 데이터는 어디에 저장되는가

> 리서치 우선. 아래 사실/관례를 근거로 viz 설계. (템플릿 B viz-first 후보)

## 수집한 출처
- MDN Blog — Image formats: Pixel data from encoders to decoders: https://developer.mozilla.org/en-US/blog/image-formats-pixels-graphics/
- swharden — Representing Images in Memory: https://swharden.com/blog/2021-06-03-images-in-memory/
- Wikipedia — Framebuffer: https://en.wikipedia.org/wiki/Framebuffer
- Collabora — A programmer's view on digital images: https://www.collabora.com/news-and-blog/blog/2016/02/16/a-programmers-view-on-digital-images-the-essentials/
- TechTarget — What is VRAM: https://www.techtarget.com/searchstorage/definition/video-RAM

## 핵심 답: 저장 위치는 3단계 (같은 이미지, 다른 형태)
1. **디스크(파일)** — PNG/JPEG 등으로 **압축·인코딩된 바이트**. 그대로는 화면에 못 그림.
2. **RAM(픽셀 배열 = 비트맵)** — 열면 **디코딩(압축 해제)** 되어 픽셀 배열로 RAM에 올라감.
   - 픽셀 하나 = 색 숫자. 보통 **RGBA 4바이트**(R,G,B,A 각 8비트 = 256단계).
   - 1000×1000 이미지 ≈ **4MB** (width×height×4).
   - 메모리 배치: row-major, **stride(행 폭)는 4바이트 배수로 패딩**, little-endian.
   - (24bit RGB도 메모리에선 보통 32bit로, 남는 8bit는 미사용 — 정렬 효율)
3. **GPU VRAM / 프레임버퍼** — 표시하려면 GPU로 업로드 → **VRAM의 프레임버퍼**가 현재 프레임의 모든 픽셀을 담음 → 회로가 비디오 신호로 변환해 모니터 출력.
   - 프레임버퍼 크기 = width×height×bpp (예: 1920×1080×4B ≈ **8.29MB**).

## 한 줄 통찰
이미지는 결국 **픽셀(숫자) 격자**이고, 그 숫자들은 **메모리 속 연속된 바이트 배열**일 뿐.
"어디에?" = **디스크(압축) → RAM(디코딩된 픽셀 배열) → VRAM 프레임버퍼(표시용)**.

## 통용 시각화 관례 (제작 시)
- **픽셀 줌**: 이미지 → 확대 → 픽셀 격자 → 픽셀 하나 → (R,G,B) 숫자 → 바이트. (가장 대표적)
- **저장 계층 흐름**: 디스크 → RAM → VRAM 3박스 + 화살표 (각 단계 형태 다름: 압축파일 / 픽셀배열 / 프레임버퍼).
- 메모리 배열: 연속 바이트 칸 (기존 memory/array viz와 유사).

## 제작 제안 (템플릿 B, viz-first)
| step | 자막 | 시각화 |
|------|------|--------|
| 1 | 이미지 = 픽셀(숫자) 격자 | 사진 → 픽셀 격자 줌 |
| 2 | 픽셀 하나 = RGBA 4바이트 | 픽셀 1개 → (R,G,B,A) 숫자/바이트 |
| 3 | 디스크엔 '압축'되어 저장 | 디스크 아이콘 + 압축 파일 |
| 4 | 열면 RAM에 픽셀배열로 풀림 | 디스크 → RAM 배열 |
| 5 | 화면엔 GPU 프레임버퍼가 | RAM → VRAM 프레임버퍼 → 모니터 |
