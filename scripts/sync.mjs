// 챕터 완료 시 변경사항을 원격(main)에 반영하는 자동 동기화 스크립트.
// 사용법: node scripts/sync.mjs "커밋 메시지"
// - 변경이 없으면 아무것도 하지 않고 조용히 종료합니다.
import { execSync } from "node:child_process";

const msg = process.argv.slice(2).join(" ") || `chore: sync ${new Date().toISOString()}`;

const run = (cmd) => execSync(cmd, { stdio: "pipe" }).toString().trim();

try {
  run("git rev-parse --is-inside-work-tree");
} catch {
  console.error("❌ git 저장소가 아닙니다. 먼저 git init 및 원격 연결이 필요합니다.");
  process.exit(1);
}

// 스테이징
run("git add -A");

// 변경사항 없으면 종료
const status = run("git status --porcelain");
if (!status) {
  console.log("✔ 변경사항 없음 — 푸시 생략");
  process.exit(0);
}

run(`git commit -m ${JSON.stringify(msg)}`);
console.log(`✅ 커밋: ${msg}`);

try {
  execSync("git push", { stdio: "inherit" });
  console.log("🚀 원격 반영 완료");
} catch {
  // upstream 미설정 시 최초 1회 설정하며 푸시
  const branch = run("git rev-parse --abbrev-ref HEAD");
  execSync(`git push -u origin ${branch}`, { stdio: "inherit" });
  console.log("🚀 원격 반영 완료 (upstream 설정)");
}
