import fs from "node:fs";
import path from "node:path";
import * as parse5 from "parse5";

const DIST = path.resolve("dist");
const REPORT = path.resolve("external-links-report.json");

const args = process.argv.slice(2);

const warnOnly = args.includes("--warn-only");
const quiet = args.includes("--quiet");

function option(name, fallback) {
  const arg = args.find((value) => value.startsWith(`--${name}=`));
  return arg ? Number(arg.split("=")[1]) : fallback;
}

const concurrency = option("concurrency", 5);
const timeout = option("timeout", 12000);
const strict = args.includes("--strict");

if (
  !Number.isInteger(concurrency) ||
  concurrency < 1 ||
  !Number.isFinite(timeout) ||
  timeout < 1
) {
  throw new Error("Invalid concurrency or timeout setting.");
}

if (!fs.existsSync(DIST)) {
  console.error("dist/ not found. Run npm run build first.");
  process.exit(1);
}

const htmlFiles = [];

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      walk(full);
    } else if (entry.name.endsWith(".html")) {
      htmlFiles.push(full);
    }
  }
}

walk(DIST);

if (htmlFiles.length === 0) {
  console.error("No HTML files found in dist/. Build may have failed.");
  process.exit(1);
}

// Map each external URL to the pages that reference it.
const links = new Map();

function collect(node, page) {
  if (node.tagName === "a") {
    const href = node.attrs?.find(
      (attribute) => attribute.name === "href",
    )?.value;

    if (href) {
      try {
        const url = new URL(href, "https://gringo.bingo/");

        const isGeneratedIssueLink =
          url.hostname === "github.com" &&
          url.pathname === "/mapachurro/eoir-glossary/issues/new";

        if (
          ["http:", "https:"].includes(url.protocol) &&
          url.hostname !== "gringo.bingo" &&
          url.hostname !== "www.gringo.bingo" &&
          !isGeneratedIssueLink
        ) {
          // Fragments aren't sent to HTTP servers.
          url.hash = "";

          const normalized = url.href;

          if (!links.has(normalized)) {
            links.set(normalized, new Set());
          }

          links.get(normalized).add(page);
        }
      } catch {
        console.warn(`Invalid URL in ${page}: ${href}`);
      }
    }
  }

  for (const child of node.childNodes || []) {
    collect(child, page);
  }
}

for (const file of htmlFiles) {
  const html = fs.readFileSync(file, "utf8");
  const page = path.relative(DIST, file);
  const document = parse5.parse(html);

  collect(document, page);
}

console.log(`HTML pages scanned: ${htmlFiles.length}`);
console.log(`Unique external URLs: ${links.size}`);

async function request(url, method) {
  const response = await fetch(url, {
    method,
    redirect: "follow",
    signal: AbortSignal.timeout(timeout),
    headers: {
      "User-Agent": "GringoBingoLinkChecker/1.0",
      Accept: "text/html,application/pdf,*/*",
    },
  });

  // Don't download an entire PDF or webpage.
  await response.body?.cancel();

  return response;
}

async function check(url) {
  let response;
  let method = "HEAD";

  try {
    response = await request(url, "HEAD");

    // Some servers reject HEAD even when GET works.
    if ([405, 501].includes(response.status)) {
      method = "GET";
      response = await request(url, "GET");
    }
  } catch (error) {
    // Retry with GET if HEAD fails.
    try {
      method = "GET";
      response = await request(url, "GET");
    } catch (secondError) {
      return {
        url,
        status: null,
        classification: "inconclusive",
        reason: String(secondError.message || secondError),
        pages: [...links.get(url)],
      };
    }
  }

  const status = response.status;
  const finalUrl = response.url;

  let classification;

  if (status >= 200 && status < 300) {
    classification = finalUrl !== url ? "redirected" : "working";
  } else if ([404, 410].includes(status)) {
    classification = "broken";
  } else {
    classification = "inconclusive";
  }

  return {
    url,
    finalUrl,
    status,
    method,
    classification,
    pages: [...links.get(url)],
  };
}

const urls = [...links.keys()];
const results = new Array(urls.length);

let nextIndex = 0;
let completed = 0;

async function worker() {
  while (nextIndex < urls.length) {
    const index = nextIndex++;
    const url = urls[index];

    results[index] = await check(url);
    completed++;

    const result = results[index];

    if (!quiet || ["broken", "inconclusive"].includes(result.classification)) {
      console.log(
        `[${completed}/${urls.length}] ` +
          `${result.classification.toUpperCase()} ` +
          `${result.status ?? "N/A"} ${url}`,
      );
    }
  }
}

await Promise.all(
  Array.from({ length: Math.min(concurrency, urls.length) }, () => worker()),
);

const summary = {
  working: 0,
  redirected: 0,
  broken: 0,
  inconclusive: 0,
};

for (const result of results) {
  summary[result.classification]++;
}

const report = {
  generatedAt: new Date().toISOString(),
  pagesScanned: htmlFiles.length,
  uniqueUrls: urls.length,
  summary,
  results,
};

fs.writeFileSync(REPORT, JSON.stringify(report, null, 2) + "\n");

console.log("\nExternal link check complete:");
console.log(`Working:      ${summary.working}`);
console.log(`Redirected:   ${summary.redirected}`);
console.log(`Broken:       ${summary.broken}`);
console.log(`Inconclusive: ${summary.inconclusive}`);
console.log(`Report:       ${REPORT}`);

if (!warnOnly && (summary.broken > 0 || (strict && summary.inconclusive > 0))) {
  process.exitCode = 1;
}
