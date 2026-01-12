/**
 * Stop Hook Verification
 *
 * Runs when Claude attempts to stop responding.
 * Blocks completion if quality gates not met.
 *
 * Quality gates (in order):
 * 1. No uncommitted changes
 * 2. Build command (if configured)
 * 3. Test command (if configured)
 * 4. Lint command (if configured)
 * 5. Format command (if configured)
 * 6. Static analysis command (if configured)
 * 7. Verification agent (test quality + requirements)
 *
 * Exit codes:
 * - 0: Allow stop
 * - 2: Block stop (stderr fed back to Claude)
 */

import { checkUncommittedChanges } from "./lib/git";
import { runCommand } from "./lib/tests";
import { loadConfig, getVerificationCommands } from "./lib/config";
import { runVerificationAgent } from "./lib/verification-agent";

async function main(): Promise<void> {
  const errors: string[] = [];

  // 1. Check for uncommitted changes (always runs)
  const uncommitted = await checkUncommittedChanges();
  if (uncommitted.length > 0) {
    errors.push(`Uncommitted changes:\n${uncommitted.join("\n")}`);
  }

  // Load project config
  const { config, path: configPath, error: configError } = loadConfig();

  if (configError) {
    errors.push(`Configuration error: ${configError}`);
  }

  // 2-6. Run configured verification commands
  if (config) {
    const commands = getVerificationCommands(config);

    for (const { name, command } of commands) {
      const result = await runCommand(command);
      if (!result.success) {
        errors.push(`${name} failed: ${command}\n${result.output}`);
      }
    }
  }

  // 7. Verification agent - check test quality and requirements
  const verificationResult = await runVerificationAgent();
  if (!verificationResult.passed) {
    errors.push(`Verification agent found issues:\n${verificationResult.issues.join("\n")}`);
  }

  if (errors.length > 0) {
    console.error("Cannot complete - quality gates not met:\n");
    console.error(errors.join("\n\n"));
    process.exit(2);
  }

  // All gates passed
  process.exit(0);
}

main().catch(err => {
  console.error("Verification error:", err.message);
  process.exit(2);
});
