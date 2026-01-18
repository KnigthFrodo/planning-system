#!/usr/bin/env bun
/**
 * Wrapper for verify-stop.ts that ensures dependencies are installed first.
 *
 * This wrapper only uses built-in Bun/Node APIs so it works even when
 * npm dependencies are not installed yet.
 */

import { existsSync } from "fs";
import { join, dirname } from "path";

const SCRIPT_DIR = dirname(import.meta.path);
const VERIFICATION_DIR = dirname(SCRIPT_DIR);
const NODE_MODULES = join(VERIFICATION_DIR, "node_modules");
const VERIFY_SCRIPT = join(VERIFICATION_DIR, "verify-stop.ts");

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
    // Don't block if deps can't be installed - exit 0 to allow stop
    console.error("[planning-system] Skipping verification due to missing dependencies");
    process.exit(0);
  }

  // Run the actual verify-stop script as a subprocess
  const proc = Bun.spawn(["bun", "run", VERIFY_SCRIPT], {
    cwd: VERIFICATION_DIR,
    stdout: "inherit",
    stderr: "inherit",
    stdin: "inherit",
  });

  const exitCode = await proc.exited;
  process.exit(exitCode);
}

main().catch(() => {
  // Silently exit 0 on wrapper errors - don't block
  process.exit(0);
});
