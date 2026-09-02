#!/usr/bin/env bun
/**
 * fetch-paper.ts — 论文全文抓取（独立单文件脚本）
 *
 * 依赖通过版本钉死的 import 由 bun 自动安装并全局缓存，无需 node_modules，
 * 首次运行需联网装包。抓取级联（源自 pi-web-suite，已内联）：
 *
 *   - PDF（远程或本地）→ unpdf 提取文本，绕开 WebFetch 解析大 PDF 时的
 *     "maximum call stack exceeded"
 *   - HTML → Readability + linkedom 本地抽取 → turndown 转 markdown
 *   - 直抓失败 → r.jina.ai → defuddle.md 代理兜底（jina 也能解析 PDF）
 *   - arXiv 链接（abs/pdf/html 任意形式）自动按 官方HTML → ar5iv → PDF 择优
 *
 * 用法: bun fetch-paper.ts <URL|本地PDF路径> [输出.md]
 *   省略输出路径则正文打印到 stdout；来源与统计信息走 stderr。
 */

import { extractText } from "unpdf@1.6.2";
import { parseHTML } from "linkedom@0.16.11";
import { Readability } from "@mozilla/readability@0.6.0";
import TurndownService from "turndown@7.2.4";

type Result = { title: string; content: string };

function die(msg: string, code = 1): never {
  console.error(msg);
  process.exit(code);
}

// ─── PDF ──────────────────────────────────────────────────────────────

async function pdfToText(buf: Uint8Array): Promise<string> {
  const { text } = await extractText(buf);
  return (Array.isArray(text) ? text.join("\n\n") : String(text)).trim();
}

function looksLikePdf(buf: Uint8Array, contentType: string): boolean {
  return (
    contentType.includes("pdf") ||
    (buf[0] === 0x25 && buf[1] === 0x50 && buf[2] === 0x44 && buf[3] === 0x46) // "%PDF"
  );
}

// ─── HTML → markdown ─────────────────────────────────────────────────

const turndown = new TurndownService({ headingStyle: "atx" });

function readabilityExtract(html: string): Result | null {
  const { document } = parseHTML(html);
  for (const sel of ["script", "style", "nav", "footer", "header", "aside", ".sidebar", ".ad", ".cookie-banner"]) {
    for (const el of document.querySelectorAll(sel)) el.remove();
  }
  const article = new Readability(document).parse();
  if (!article) return null;
  const articleHtml = article.content?.trim() ?? "";
  const text = article.textContent?.trim() ?? "";
  const content = articleHtml ? turndown.turndown(articleHtml) : text;
  if (content.length < 50) return null; // 太短说明抽取失败
  return { title: article.title?.trim() ?? "", content };
}

// ─── 抓取级联 ─────────────────────────────────────────────────────────

async function proxyFetch(url: string, template: string): Promise<string | null> {
  try {
    const res = await fetch(template.replace("{url}", encodeURIComponent(url)), {
      signal: AbortSignal.timeout(30000),
    });
    if (!res.ok) return null;
    const text = (await res.text()).trim();
    return text.length < 100 ? null : text; // 太短说明代理返回了空页
  } catch {
    return null;
  }
}

async function fetchOne(url: string, useProxy: boolean): Promise<Result> {
  try {
    const res = await fetch(url, {
      signal: AbortSignal.timeout(30000),
      redirect: "follow",
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; paper-master/1.0)",
        Accept: "text/html,application/pdf,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
    });
    if (res.ok) {
      const contentType = res.headers.get("content-type") ?? "";
      const buf = new Uint8Array(await res.arrayBuffer());
      if (looksLikePdf(buf, contentType)) {
        const content = await pdfToText(buf);
        if (content) return { title: "", content };
      } else {
        const body = new TextDecoder().decode(buf);
        if (contentType.includes("json") || contentType.includes("text/plain")) {
          return { title: "", content: body.trim() };
        }
        const local = readabilityExtract(body);
        if (local) return local;
      }
    }
  } catch {
    // 落到代理
  }

  if (useProxy) {
    const jina = await proxyFetch(url, "https://r.jina.ai/{url}");
    if (jina) {
      const title = jina.match(/^Title: (.+)$/m)?.[1]?.trim() ?? "";
      const body = jina.replace(/^Title: .+\nURL Source: .+\n\n/m, "").trim();
      return { title, content: body };
    }
    const defuddle = await proxyFetch(url, "https://defuddle.md/{url}");
    if (defuddle) return { title: "", content: defuddle };
  }

  throw new Error(`无法获取内容: ${url}`);
}

// ─── main ─────────────────────────────────────────────────────────────

const [input, outPath] = Bun.argv.slice(2);
if (!input) die("用法: bun fetch-paper.ts <URL|本地PDF路径> [输出.md]");

let result: Result;

if (!/^https?:\/\//i.test(input)) {
  // 本地 PDF
  const file = Bun.file(input);
  if (!(await file.exists())) die(`文件不存在: ${input}`);
  if (!input.toLowerCase().endsWith(".pdf")) die("本地文件仅支持 .pdf（markdown/文本文件直接读即可）");
  const content = await pdfToText(new Uint8Array(await file.arrayBuffer()));
  if (!content) die("PDF 无可提取文本（可能是扫描版，需 OCR）");
  result = { title: "", content };
} else {
  const arxivId = input
    .match(/arxiv\.org\/(?:abs|pdf|html)\/([^\s?#]+?)(?:\.pdf)?(?:[?#].*)?$/i)?.[1]
    ?.replace(/\/+$/, "");
  const candidates = arxivId
    ? [
        `https://arxiv.org/html/${arxivId}`,
        `https://ar5iv.labs.arxiv.org/html/${arxivId}`,
        `https://arxiv.org/pdf/${arxivId}`,
      ]
    : [input];

  let picked: Result | null = null;
  let lastErr: unknown;
  for (const url of candidates) {
    // arXiv 的 HTML 候选只直抓（404 就快速换下一个源），最后的 PDF 候选与普通 URL 才用代理兜底
    const isArxivHtml = Boolean(arxivId) && url.includes("/html/");
    try {
      const r = await fetchOne(url, !isArxivHtml);
      if (isArxivHtml && r.content.length < 5000) {
        lastErr = new Error(`${url} 内容过短(${r.content.length} 字符)，疑似摘要页`);
        continue;
      }
      if (!r.content) {
        lastErr = new Error(`${url} 内容为空`);
        continue;
      }
      console.error(`来源: ${url}`);
      picked = r;
      break;
    } catch (e) {
      lastErr = e;
    }
  }
  if (!picked) die(`抓取失败: ${(lastErr as any)?.message ?? "未知错误"}`);
  result = picked;
}

if (result.content.length < 1000) {
  console.error(`⚠ 内容异常短(${result.content.length} 字符)，可能未抓到全文`);
}

const md = (result.title ? `# ${result.title}\n\n` : "") + result.content + "\n";
if (outPath) {
  await Bun.write(outPath, md);
  console.error(`✓ 已写入 ${outPath}（${result.content.length} 字符${result.title ? `，标题: ${result.title}` : ""}）`);
} else {
  console.log(md);
}
