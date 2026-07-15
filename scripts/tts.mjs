// narration(스크립트)을 edge-tts로 세그먼트별 음성 합성 + 길이 측정 → content JSON에 audio 기록.
// 사용법: node scripts/tts.mjs content/concept/tcp-handshake.json [voice]
// 음성 파일: public/audio/<name>/seg-*.mp3, 타이밍은 audio 블록에 durationInFrames로 저장.
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { basename, extname, resolve } from "node:path";

const FPS = 30;
const PAD = 12; // 세그먼트 끝 여유(프레임)

const contentPath = process.argv[2];
const voice = process.argv[3] || "ko-KR-SunHiNeural";
if (!contentPath || !existsSync(contentPath)) {
  console.error("❌ content 파일 경로를 주세요. 예: node scripts/tts.mjs content/concept/tcp-handshake.json");
  process.exit(1);
}

const json = JSON.parse(readFileSync(contentPath, "utf8"));
const nar = json.narration;
if (!nar || !nar.intro) {
  console.error("❌ narration(intro/steps)이 없습니다. 먼저 스크립트를 작성하세요.");
  process.exit(1);
}

const name = basename(contentPath, extname(contentPath));
const relDir = `audio/${name}`;
const absDir = resolve("public", relDir);
mkdirSync(absDir, { recursive: true });

const synth = (text, file) => {
  const out = resolve(absDir, file);
  execFileSync("python", ["-m", "edge_tts", "--voice", voice, "--text", text, "--write-media", out], {
    stdio: "pipe",
  });
  const durSec = parseFloat(
    execFileSync("ffprobe", [
      "-v", "error", "-show_entries", "format=duration",
      "-of", "default=noprint_wrappers=1:nokey=1", out,
    ]).toString().trim()
  );
  const durationInFrames = Math.ceil(durSec * FPS) + PAD;
  console.log(`🔊 ${file}  ${durSec.toFixed(2)}s → ${durationInFrames}f  "${text.slice(0, 24)}..."`);
  return { file, durationInFrames };
};

console.log(`🎙️  voice=${voice}  → ${relDir}`);
const introSeg = { ...synth(nar.intro, "seg-intro.mp3") };
const steps = (nar.steps ?? []).map((t, i) => synth(t, `seg-${i}.mp3`));

json.audio = { voice, dir: relDir, intro: introSeg, steps };
writeFileSync(contentPath, JSON.stringify(json, null, 2) + "\n");
console.log(`\n✅ ${contentPath} 에 audio 타이밍 기록 완료. 이제 npm run render 하세요.`);
