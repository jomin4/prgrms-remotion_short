import { interpolate, spring } from "remotion";

// 프레임 기준 페이드+상승 진입 애니메이션 값
export const fadeUp = (
  frame: number,
  fps: number,
  delay = 0,
  distance = 40
) => {
  const s = spring({
    frame: frame - delay,
    fps,
    config: { damping: 200 },
    durationInFrames: 20,
  });
  return {
    opacity: interpolate(s, [0, 1], [0, 1]),
    transform: `translateY(${interpolate(s, [0, 1], [distance, 0])}px)`,
  };
};

// 씬 시작/끝 페이드 (durationInFrames 기준)
export const sceneFade = (frame: number, duration: number, pad = 8) => {
  return interpolate(
    frame,
    [0, pad, duration - pad, duration],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
};
