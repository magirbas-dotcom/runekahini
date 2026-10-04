// Minimal Chrome DevTools Protocol driver (Node 24: global fetch + WebSocket), no dependencies.
import { spawn } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";

const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const PORT = 9333;

export async function launch(profileDir) {
  mkdirSync(profileDir, { recursive: true });
  const proc = spawn(
    CHROME,
    [
      "--headless=new",
      `--remote-debugging-port=${PORT}`,
      `--user-data-dir=${profileDir}`,
      "--no-first-run",
      "--no-default-browser-check",
      "--lang=tr-TR",
      "--hide-scrollbars",
      "about:blank",
    ],
    { stdio: "ignore" },
  );
  for (let i = 0; i < 50; i++) {
    try {
      const list = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json();
      const page = list.find((t) => t.type === "page");
      if (page) return { proc, ...(await connect(page.webSocketDebuggerUrl)) };
    } catch {}
    await sleep(200);
  }
  throw new Error("Chrome did not start");
}

async function connect(url) {
  const ws = new WebSocket(url);
  await new Promise((r, j) => {
    ws.onopen = r;
    ws.onerror = j;
  });
  let id = 0;
  const pending = new Map();
  ws.onmessage = (m) => {
    const msg = JSON.parse(m.data);
    if (msg.id && pending.has(msg.id)) {
      const { res, rej } = pending.get(msg.id);
      pending.delete(msg.id);
      msg.error ? rej(new Error(JSON.stringify(msg.error))) : res(msg.result);
    }
  };
  const send = (method, params = {}) =>
    new Promise((res, rej) => {
      const n = ++id;
      pending.set(n, { res, rej });
      ws.send(JSON.stringify({ id: n, method, params }));
    });
  return { ws, send };
}

export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export function page(send, outDir) {
  mkdirSync(outDir, { recursive: true });
  return {
    async phone(width = 390, height = 844, scale = 3) {
      await send("Emulation.setDeviceMetricsOverride", { width, height, deviceScaleFactor: scale, mobile: true });
    },
    async go(url, wait = 6000) {
      await send("Page.navigate", { url });
      await sleep(wait);
    },
    async eval(expression) {
      const r = await send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true });
      if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description ?? "eval failed");
      return r.result.value;
    },
    async click(text, wait = 1500) {
      const ok = await this.eval(`(() => {
        const els = [...document.querySelectorAll('[role=button],[role=link],[role=radio],[role=tab],button,a,[tabindex]')]
          .filter(e => e.textContent.trim() === ${JSON.stringify(text)} || (e.getAttribute("aria-label") || "").startsWith(${JSON.stringify(text)}));
        if (!els.length) return false; els[0].click(); return true; })()`);
      if (!ok) throw new Error(`no element: ${text}`);
      await sleep(wait);
    },
    async shot(name) {
      const r = await send("Page.captureScreenshot", { format: "png" });
      writeFileSync(`${outDir}/${name}.png`, Buffer.from(r.data, "base64"));
      console.log("saved", name);
    },
  };
}
