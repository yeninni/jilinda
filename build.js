const fs = require("fs");
const path = require("path");

const outputDir = path.join(__dirname, "dist");
const serverDir = path.join(outputDir, "server");
const hostingDir = path.join(outputDir, ".openai");
const files = ["index.html", "styles.css", "script.js"];
const contentTypes = {
  "index.html": "text/html; charset=utf-8",
  "styles.css": "text/css; charset=utf-8",
  "script.js": "text/javascript; charset=utf-8"
};

fs.rmSync(outputDir, { recursive: true, force: true });
fs.mkdirSync(outputDir, { recursive: true });
fs.mkdirSync(serverDir, { recursive: true });
fs.mkdirSync(hostingDir, { recursive: true });

const assets = {};
for (const file of files) {
  const content = fs.readFileSync(path.join(__dirname, file), "utf8");
  assets[file] = {
    content,
    contentType: contentTypes[file]
  };
  fs.writeFileSync(path.join(outputDir, file), content);
}

fs.copyFileSync(path.join(__dirname, ".openai", "hosting.json"), path.join(hostingDir, "hosting.json"));

const worker = `const assets = ${JSON.stringify(assets)};

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const pathname = url.pathname === "/" ? "/index.html" : url.pathname;
    const fileName = pathname.replace(/^\\//, "");
    const asset = assets[fileName];

    if (!asset) {
      return new Response("Not found", { status: 404 });
    }

    return new Response(asset.content, {
      headers: {
        "Content-Type": asset.contentType,
        "Cache-Control": "public, max-age=60"
      }
    });
  }
};
`;

fs.writeFileSync(path.join(serverDir, "index.js"), worker);
