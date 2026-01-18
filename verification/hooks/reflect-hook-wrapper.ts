#!/usr/bin/env bun
/**
 * Wrapper for reflect-hook.ts that ensures dependencies are installed first.
 *
 * This wrapper only uses built-in Bun/Node APIs so it works even when
 * npm dependencies are not installed yet.
 */

import { existsSync } from "fs";
import { join, dirname } from "path";

const SCRIPT_DIR = dirname(import.meta.path);
const VERIFICATION_DIR = dirname(SCRIPT_DIR);
const NODE_MODULES = join(VERIFICATION_DIR, "node_modules");
const REFLECT_SCRIPT = join(VERIFICATION_DIR, "reflect-hook.ts");

async function ensureDeps(): Promise<boolean> {
  if (existsSync(NODE_MODULES)) {
    return true;
  }

  console.error("[planning-system] Installing dependencies...");

  try {
    const proc = Bun.spawn(["bun", "install"], {
      cwd: VERIFICATION_DIR,
      stdout: "inherit",
      stderr: "inherit",
    });
    await proc.exited;

    if (proc.exitCode === 0) {
      console.error("[planning-system] Dependencies installed successfully");
      return true;
    } else {
      console.error("[planning-system] bun install failed");
      return false;
    }
  } catch (err: any) {
    console.error(`[planning-system] Failed to install dependencies: ${err.message}`);
    console.error(`[planning-system] Please run: cd ${VERIFICATION_DIR} && bun install`);
    return false;
  }
}

async function main() {
  const depsOk = await ensureDeps();
  if (!depsOk) {
    // Don't block - exit 0 to allow stop
    console.error("[planning-system] Skipping reflection due to missing dependencies");
    process.exit(0);
  }

  // Run the actual reflect-hook script as a subprocess
  const proc = Bun.spawn(["bun", "run", REFLECT_SCRIPT], {
    cwd: VERIFICATION_DIR,
    stdout: "inherit",
    stderr: "inherit",
    stdin: "inherit",
  });

  const exitCode = await proc.exited;
  process.exit(exitCode);
}

main().catch((err) => {
  console.error("[planning-system] Wrapper error:", err.message);
  process.exit(0);
});
