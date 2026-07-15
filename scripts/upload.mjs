// 사용법: node scripts/upload.mjs [content/파일.json] [privacy]
//   privacy: private(기본) | unlisted | public
// 렌더된 out/<이름>.mp4 를 content JSON의 메타데이터로 YouTube에 업로드합니다.
import { google } from "googleapis";
import { readFileSync, existsSync, createReadStream } from "node:fs";
import { basename, extname, resolve } from "node:path";

function loadEnv() {
  if (existsSync(".env")) {
    for (const line of readFileSync(".env", "utf8").split("\n")) {
      const m = line.match(/^\s*([\w.]+)\s*=\s*(.*)\s*$/);
      if (m) process.env[m[1]] ??= m[2].replace(/^["']|["']$/g, "");
    }
  }
}
loadEnv();

const contentPath = process.argv[2] ?? "content/explainer/git-reset.json";
const privacy = process.argv[3] ?? "private"; // 안전을 위해 기본 비공개

if (!existsSync("token.json")) {
  console.error("❌ token.json 이 없습니다. 먼저 `npm run auth` 를 실행하세요.");
  process.exit(1);
}
const name = basename(contentPath, extname(contentPath));
const videoPath = resolve("out", `${name}.mp4`);
if (!existsSync(videoPath)) {
  console.error(`❌ 렌더 파일이 없습니다: ${videoPath} (먼저 npm run render)`);
  process.exit(1);
}

const content = JSON.parse(readFileSync(contentPath, "utf8"));
const meta = content.meta ?? {};

const oauth2 = new google.auth.OAuth2(
  process.env.YT_CLIENT_ID,
  process.env.YT_CLIENT_SECRET
);
oauth2.setCredentials(JSON.parse(readFileSync("token.json", "utf8")));
const youtube = google.youtube({ version: "v3", auth: oauth2 });

console.log(`⬆️  업로드: ${videoPath}  (공개범위: ${privacy})`);

const res = await youtube.videos.insert({
  part: ["snippet", "status"],
  requestBody: {
    snippet: {
      title: meta.youtubeTitle ?? name,
      description: meta.youtubeDescription ?? "",
      tags: meta.tags ?? [],
      categoryId: "28", // Science & Technology
    },
    status: {
      privacyStatus: privacy,
      selfDeclaredMadeForKids: false,
    },
  },
  media: { body: createReadStream(videoPath) },
});

console.log(`\n✅ 업로드 완료!`);
console.log(`   videoId: ${res.data.id}`);
console.log(`   URL: https://youtu.be/${res.data.id}`);
