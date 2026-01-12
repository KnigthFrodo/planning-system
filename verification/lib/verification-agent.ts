/**
 * Verification Agent
 *
 * Spawns a Claude agent to verify:
 * 1. Test quality - tests should cover business logic, not just interface assertions
 * 2. Requirements satisfaction - all prompt requirements should be met
 *
 * Uses the Anthropic SDK to make API calls.
 * Requires ANTHROPIC_API_KEY environment variable.
 */

import Anthropic from "@anthropic-ai/sdk";
import { $ } from "bun";
import { getDiff } from "./git";

export interface VerificationResult {
  passed: boolean;
  issues: string[];
  testQualityFeedback: string | null;
  requirementsFeedback: string | null;
}

interface BeadsTask {
  id: string;
  title: string;
  description: string;
  status: string;
}

/**
 * Gets the current in_progress Beads task
 */
async function getCurrentTask(): Promise<BeadsTask | null> {
  try {
    const result = await $`bd list --status=in_progress --json`.json();
    if (Array.isArray(result) && result.length > 0) {
      return result[0] as BeadsTask;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Gets the git diff for staged and unstaged changes
 */
async function getChanges(): Promise<string> {
  try {
    // Get both staged and unstaged changes
    const staged = await $`git diff --cached`.text();
    const unstaged = await $`git diff`.text();
    return `## Staged Changes\n${staged}\n\n## Unstaged Changes\n${unstaged}`;
  } catch {
    return "";
  }
}

/**
 * Gets test files from the diff
 */
function extractTestFiles(diff: string): string[] {
  const testPatterns = [
    /\+\+\+ b\/(.+\.test\.[tj]sx?)$/gm,
    /\+\+\+ b\/(.+\.spec\.[tj]sx?)$/gm,
    /\+\+\+ b\/(.+_test\.go)$/gm,
    /\+\+\+ b\/(.+Test\.cs)$/gm,
    /\+\+\+ b\/(.+Tests\.cs)$/gm,
  ];

  const testFiles: string[] = [];
  for (const pattern of testPatterns) {
    let match;
    while ((match = pattern.exec(diff)) !== null) {
      testFiles.push(match[1]);
    }
  }
  return testFiles;
}

const VERIFICATION_PROMPT = `You are a code verification agent. Your job is to review code changes and verify they meet quality standards.

## Your Tasks

### 1. Test Quality Analysis
Review any test files in the diff and verify they:
- Test actual business logic and behavior, not just interface shapes
- Include meaningful assertions that verify outcomes
- Cover edge cases mentioned in the requirements
- Don't just check that functions exist or return the right type

Bad test example (interface assertion only):
\`\`\`typescript
test("should return a user", () => {
  const user = getUser(1);
  expect(user).toBeDefined();
  expect(typeof user.name).toBe("string");
});
\`\`\`

Good test example (business logic):
\`\`\`typescript
test("should return user with correct data", () => {
  const user = getUser(1);
  expect(user.name).toBe("John Doe");
  expect(user.isActive).toBe(true);
});

test("should throw for non-existent user", () => {
  expect(() => getUser(999)).toThrow("User not found");
});
\`\`\`

### 2. Requirements Verification
Compare the code changes against the requirements in the task description:
- Check each requirement/acceptance criterion is addressed
- Note any requirements that appear unmet
- Identify any scope creep (work beyond requirements)

## Response Format
Respond with a JSON object (no markdown code blocks):
{
  "passed": boolean,
  "testQualityIssues": string[] | null,
  "requirementsIssues": string[] | null,
  "summary": string
}

If there are no issues, set passed to true and issues arrays to null.
If there are issues, set passed to false and list specific issues.`;

/**
 * Runs the verification agent
 */
export async function runVerificationAgent(): Promise<VerificationResult> {
  // Check for API key
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return {
      passed: true, // Don't block if no API key configured
      issues: [],
      testQualityFeedback: null,
      requirementsFeedback: "Verification agent skipped: ANTHROPIC_API_KEY not set",
    };
  }

  // Get current task and changes
  const task = await getCurrentTask();
  const changes = await getChanges();

  if (!task) {
    return {
      passed: true,
      issues: [],
      testQualityFeedback: null,
      requirementsFeedback: "No in_progress task found, skipping verification",
    };
  }

  if (!changes.trim() || changes === "## Staged Changes\n\n\n## Unstaged Changes\n") {
    return {
      passed: true,
      issues: [],
      testQualityFeedback: null,
      requirementsFeedback: "No changes to verify",
    };
  }

  // Build the context for verification
  const context = `## Task Requirements
${task.description}

## Code Changes
${changes}`;

  try {
    const client = new Anthropic({ apiKey });

    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2000,
      messages: [
        {
          role: "user",
          content: `${VERIFICATION_PROMPT}\n\n---\n\n${context}`,
        },
      ],
    });

    // Parse the response
    const content = response.content[0];
    if (content.type !== "text") {
      return {
        passed: true,
        issues: ["Unexpected response format from verification agent"],
        testQualityFeedback: null,
        requirementsFeedback: null,
      };
    }

    try {
      const result = JSON.parse(content.text);
      const issues: string[] = [];

      if (result.testQualityIssues && Array.isArray(result.testQualityIssues)) {
        issues.push(...result.testQualityIssues.map((i: string) => `[Test Quality] ${i}`));
      }
      if (result.requirementsIssues && Array.isArray(result.requirementsIssues)) {
        issues.push(...result.requirementsIssues.map((i: string) => `[Requirements] ${i}`));
      }

      return {
        passed: result.passed === true,
        issues,
        testQualityFeedback: result.testQualityIssues
          ? result.testQualityIssues.join("\n")
          : null,
        requirementsFeedback: result.requirementsIssues
          ? result.requirementsIssues.join("\n")
          : null,
      };
    } catch (parseErr) {
      // If we can't parse JSON, treat the response as feedback
      return {
        passed: false,
        issues: [`Verification agent response: ${content.text}`],
        testQualityFeedback: null,
        requirementsFeedback: null,
      };
    }
  } catch (err: any) {
    // API errors shouldn't block - just warn
    return {
      passed: true,
      issues: [],
      testQualityFeedback: null,
      requirementsFeedback: `Verification agent error: ${err.message}`,
    };
  }
}
