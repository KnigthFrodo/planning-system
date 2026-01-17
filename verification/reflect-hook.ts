#!/usr/bin/env bun
/**
 * Reflect Stop Hook
 *
 * Runs when Claude attempts to stop responding.
 * Only triggers reflection if automatic mode is enabled.
 *
 * Exit codes:
 * - 0: Always (never blocks stop)
 */

import { createInterface } from "readline";
import { isEnabled, recordReflection } from "./lib/reflect-config";
import { analyzeConversation } from "./lib/reflect-agent";
import {
  ensureSkillFile,
  formatLearningsSection,
  appendToSkillFile,
  gitCommitChanges,
  isGitAvailable,
} from "./lib/reflect-utils";

/**
 * Prompts user for input
 */
async function prompt(question: string): Promise<string> {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim().toLowerCase());
    });
  });
}

async function main(): Promise<void> {
  // 1. Check if automatic reflection is enabled
  if (!isEnabled()) {
    // Silently exit - reflection is disabled
    process.exit(0);
  }

  // 2. Get conversation transcript from CLAUDE_TRANSCRIPT env var
  const transcript = process.env.CLAUDE_TRANSCRIPT;
  if (!transcript) {
    // No transcript available, skip silently
    process.exit(0);
  }

  // 3. Analyze conversation
  const result = await analyzeConversation(transcript);
  if (result.skipped || result.learnings.length === 0) {
    // Nothing to apply, skip silently (EC09)
    process.exit(0);
  }

  // 4. Filter to high-confidence learnings only (for automatic mode)
  const highConfidenceLearnings = result.learnings.filter(
    (l) => l.confidence === "high"
  );
  if (highConfidenceLearnings.length === 0) {
    // No high-confidence learnings, skip silently
    process.exit(0);
  }

  // 5. Display learnings and prompt for approval
  console.log("\n=== Reflect: High-Confidence Learnings Detected ===");
  for (const learning of highConfidenceLearnings) {
    console.log(`\n  - ${learning.rule}`);
    console.log(`    Evidence: "${learning.evidence}"`);
  }
  console.log();

  // 6. Prompt for approval
  const answer = await prompt("Apply these learnings to skill file? (y/n): ");

  if (answer !== "y" && answer !== "yes") {
    console.log("Skipped.");
    process.exit(0);
  }

  // 7. Apply changes
  const skillFile = ensureSkillFile();
  const content = formatLearningsSection(highConfidenceLearnings);
  appendToSkillFile(skillFile, content);

  // 8. Commit if git available
  if (await isGitAvailable()) {
    const commitResult = await gitCommitChanges(
      skillFile,
      `docs(reflect): auto-add ${highConfidenceLearnings.length} high-confidence learnings`
    );

    if (commitResult.success) {
      console.log(`Applied and committed to ${skillFile}`);
    } else {
      console.log(
        `Applied to ${skillFile} (not committed: ${commitResult.error})`
      );
    }
  } else {
    console.log(`Applied to ${skillFile}`);
  }

  // 9. Record reflection in state
  recordReflection(highConfidenceLearnings.length);

  process.exit(0);
}

main().catch((err) => {
  // Never block on errors - just log and exit 0
  console.error("Reflect hook error:", err.message);
  process.exit(0);
});
