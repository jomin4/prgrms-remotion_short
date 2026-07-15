// 최초 1회만 실행하는 YouTube OAuth 인증 스크립트.
// 실행 전 준비: Google Cloud에서 OAuth 클라이언트(데스크톱 앱)를 만들고
//   client_id / client_secret 를 .env 에 넣어주세요. (README 참고)
import { google } from "googleapis";
import http from "node:http";
import { writeFileSync, readFileSync, existsSync } from "node:fs";
import { URL } from "node:url";

function loadEnv() {
  if (existsSync(".env")) {
    for (const line of readFileSync(".env", "utf8").split("\n")) {
      const m = line.match(/^\s*([\w.]+)\s*=\s*(.*)\s*$/);
      if (m) process.env[m[1]] ??= m[2].replace(/^["']|["']$/g, "");
    }
  }
}
loadEnv();

const CLIENT_ID = process.env.YT_CLIENT_ID;
const CLIENT_SECRET = process.env.YT_CLIENT_SECRET;
const PORT = 53682;
const REDIRECT = `http://localhost:${PORT}/oauth2callback`;

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error("❌ .env 에 YT_CLIENT_ID / YT_CLIENT_SECRET 를 설정하세요.");
  process.exit(1);
}

const oauth2 = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT);
const authUrl = oauth2.generateAuthUrl({
  access_type: "offline",
  prompt: "consent",
  scope: ["https://www.googleapis.com/auth/youtube.upload"],
});

console.log("\n브라우저에서 아래 주소를 열어 Google 계정으로 로그인/승인하세요:\n");
console.log(authUrl + "\n");

const server = http.createServer(async (req, res) => {
  if (!req.url.startsWith("/oauth2callback")) return;
  const code = new URL(req.url, REDIRECT).searchParams.get("code");
  res.end("인증 완료! 이 창을 닫고 터미널로 돌아가세요.");
  server.close();
  const { tokens } = await oauth2.getToken(code);
  writeFileSync("token.json", JSON.stringify(tokens, null, 2));
  console.log("\n✅ token.json 저장 완료. 이제 npm run upload 로 업로드할 수 있습니다.");
  process.exit(0);
});
server.listen(PORT, () =>
  console.log(`(로컬 콜백 서버 대기 중: ${REDIRECT})`)
);
