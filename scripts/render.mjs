// 사용법: node scripts/render.mjs <content/파일.json>
// JSON의 "composition" 필드(Explainer | CodeAnalysis)를 읽어 해당 컴포지션을 렌더합니다.
import { spawn } from "node:child_process";
import { basename, extname, resolve } from "node:path";
import { existsSync, mkdirSync, readFileSync } from "node:fs";

const contentPath = process.argv[2] ?? "content/explainer/git-reset.json";
if (!existsSync(contentPath)) {
  console.error(`❌ content 파일을 찾을 수 없습니다: ${contentPath}`);
  process.exit(1);
}

const json = JSON.parse(readFileSync(contentPath, "utf8"));
const compId = json.composition ?? "Explainer";

const name = basename(contentPath, extname(contentPath));
mkdirSync("out", { recursive: true });
const outPath = resolve("out", `${name}.mp4`);

const args = [
  "remotion",
  "render",
  "src/index.ts",
  compId,
  outPath,
  `--props=${resolve(contentPath)}`,
];

console.log(`🎬 렌더 시작: [${compId}] ${contentPath} → ${outPath}`);
const child = spawn("npx", args, { stdio: "inherit", shell: true });
child.on("exit", (code) => {
  if (code === 0) console.log(`\n✅ 완료: ${outPath}`);
  process.exit(code ?? 0);
});
