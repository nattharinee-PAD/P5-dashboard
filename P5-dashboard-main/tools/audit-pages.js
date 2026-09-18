const http = require("http");
const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");

const root = process.cwd();
const outDir = path.join(root, "audit-output");
const screenshotsDir = path.join(outDir, "screenshots");

const contentTypes = new Map([
  [".html", "text/html; charset=utf-8"],
  [".css", "text/css; charset=utf-8"],
  [".js", "application/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".csv", "text/csv; charset=utf-8"],
  [".svg", "image/svg+xml"],
  [".png", "image/png"],
  [".jpg", "image/jpeg"],
  [".jpeg", "image/jpeg"],
  [".webp", "image/webp"],
  [".woff", "font/woff"],
  [".woff2", "font/woff2"],
  [".ttf", "font/ttf"],
]);

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  return entries.flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if ([".git", "node_modules", "audit-output"].includes(entry.name)) return [];
      return walk(full);
    }
    return full.endsWith(".html") ? [full] : [];
  });
}

function safeName(file) {
  return path.relative(root, file).replace(/[^a-z0-9]+/gi, "_").replace(/^_|_$/g, "");
}

function serveFile(req, res) {
  const url = new URL(req.url, "http://127.0.0.1");
  const decoded = decodeURIComponent(url.pathname);
  const requested = decoded === "/" ? "/index.html" : decoded;
  const file = path.normalize(path.join(root, requested));

  if (!file.startsWith(root)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  fs.readFile(file, (error, body) => {
    if (error) {
      res.writeHead(404);
      res.end("Not found");
      return;
    }
    res.writeHead(200, {
      "Content-Type": contentTypes.get(path.extname(file).toLowerCase()) || "application/octet-stream",
    });
    res.end(body);
  });
}

async function main() {
  fs.mkdirSync(screenshotsDir, { recursive: true });

  const server = http.createServer(serveFile);
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const port = server.address().port;

  const htmlFiles = walk(root).sort((a, b) => a.localeCompare(b));
  const chromePath = process.env.CHROME_PATH || "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
  const launchOptions = fs.existsSync(chromePath) ? { executablePath: chromePath } : {};
  const browser = await chromium.launch(launchOptions);
  const results = [];

  for (const file of htmlFiles) {
    const rel = path.relative(root, file).replace(/\\/g, "/");
    const url = `http://127.0.0.1:${port}/${rel.split("/").map(encodeURIComponent).join("/")}`;
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
    const consoleMessages = [];
    const pageErrors = [];
    const failedRequests = [];
    const badResponses = [];

    page.on("console", (message) => {
      const type = message.type();
      if (["error", "warning"].includes(type)) {
        consoleMessages.push({ type, text: message.text().slice(0, 500) });
      }
    });
    page.on("pageerror", (error) => {
      pageErrors.push(String(error.stack || error.message || error).slice(0, 1000));
    });
    page.on("requestfailed", (request) => {
      failedRequests.push({
        url: request.url(),
        failure: request.failure() ? request.failure().errorText : "unknown",
      });
    });
    page.on("response", (response) => {
      const status = response.status();
      if (status >= 400) {
        badResponses.push({ status, url: response.url() });
      }
    });

    let title = "";
    let bodyTextLength = 0;
    let status = null;
    let screenshot = "";
    let loadError = "";

    try {
      const response = await page.goto(url, { waitUntil: "domcontentloaded", timeout: 20000 });
      status = response ? response.status() : null;
      await page.waitForTimeout(2500);
      title = await page.title();
      bodyTextLength = await page.locator("body").innerText({ timeout: 5000 }).then((text) => text.trim().length).catch(() => 0);
      screenshot = path.join(screenshotsDir, `${safeName(file)}.png`);
      await page.screenshot({ path: screenshot, fullPage: true });
    } catch (error) {
      loadError = String(error.stack || error.message || error).slice(0, 1000);
    } finally {
      await page.close();
    }

    results.push({
      file: rel,
      url,
      status,
      title,
      bodyTextLength,
      screenshot: screenshot ? path.relative(root, screenshot).replace(/\\/g, "/") : "",
      loadError,
      consoleMessages,
      pageErrors,
      failedRequests,
      badResponses,
    });
  }

  await browser.close();
  server.close();

  const reportFile = path.join(outDir, "page-audit.json");
  fs.writeFileSync(reportFile, JSON.stringify({ generatedAt: new Date().toISOString(), results }, null, 2));

  const summary = results.map((result) => ({
    file: result.file,
    status: result.status,
    title: result.title,
    bodyTextLength: result.bodyTextLength,
    loadError: Boolean(result.loadError),
    consoleErrors: result.consoleMessages.filter((item) => item.type === "error").length,
    consoleWarnings: result.consoleMessages.filter((item) => item.type === "warning").length,
    pageErrors: result.pageErrors.length,
    failedRequests: result.failedRequests.length,
    badResponses: result.badResponses.length,
    screenshot: result.screenshot,
  }));

  console.log(JSON.stringify(summary, null, 2));
  console.error(`Wrote ${reportFile}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
