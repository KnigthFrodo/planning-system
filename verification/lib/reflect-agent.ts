/**
 * Reflect Agent
 *
 * AI-powered conversation analysis that extracts learnings with confidence levels.
 * Uses the Anthropic SDK following the verification-agent.ts pattern.
 *
 * Confidence Levels:
 * - High: Explicit corrections ("never do X", "always use Y")
 * - Medium: Success patterns (approaches that received approval)
 * - Low: Observations (implicit preferences)
 */

import Anthropic from "@anthropic-ai/sdk";
import type { Learning } from "./reflect-utils";

export interface ReflectResult {
  learnings: Learning[];
  skipped: boolean;
  skipReason?: string;
}

const MAX_TRANSCRIPT_CHARS = 50000;

const ANALYSIS_PROMPT = `You are an expert at analyzing conversations to extract learned preferences and patterns.

## Your Task

Analyze the conversation transcript and identify learnings that should be persisted as rules for future sessions.

## Confidence Levels

### High Confidence (explicit corrections)
Look for:
- "Never do X" / "Don't do X" / "Stop doing X"
- "Always use Y" / "Make sure to Y"
- Direct corrections with imperative language
- Explicit statements of preference with strong language

### Medium Confidence (success patterns)
Look for:
- Approaches that received explicit approval ("yes", "looks good", "perfect", "that's right")
- Patterns that successfully solved problems
- Techniques the user expressed satisfaction with

### Low Confidence (observations)
Look for:
- Implicit preferences (user's style in their messages)
- Patterns that weren't explicitly confirmed but seem preferred
- Unconfirmed observations

## Response Format

Respond with ONLY a JSON object (no markdown code blocks, no explanation):
{
  "learnings": [
    {
      "confidence": "high" | "medium" | "low",
      "rule": "A concise rule describing the preference (imperative form)",
      "evidence": "Exact quote or close paraphrase from the conversation"
    }
  ]
}

Important:
- Only include genuine learnings that would be useful for future sessions
- Rules should be actionable and specific
- Evidence should be a direct quote when possible
- If no learnings are found, return {"learnings": []}
- Prefer fewer high-quality learnings over many low-quality ones`;

/**
 * Truncates transcript to fit within token limits, keeping most recent content
 */
export function truncateTranscript(
  transcript: string,
  maxChars: number = MAX_TRANSCRIPT_CHARS
): string {
  if (transcript.length <= maxChars) {
    return transcript;
  }

  const truncatedContent = transcript.slice(-maxChars);
  return `[Earlier conversation truncated]\n\n${truncatedContent}`;
}

/**
 * Gets today's date in YYYY-MM-DD format
 */
function getTodayDate(): string {
  return new Date().toISOString().split("T")[0];
}

/**
 * Analyzes a conversation transcript to extract learnings
 */
export async function analyzeConversation(
  transcript: string
): Promise<ReflectResult> {
  // EC01: Missing API Key - Skip gracefully
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return {
      learnings: [],
      skipped: true,
      skipReason: "ANTHROPIC_API_KEY not set",
    };
  }

  // EC06: Empty Conversation
  if (!transcript.trim()) {
    return {
      learnings: [],
      skipped: true,
      skipReason: "Empty conversation transcript",
    };
  }

  // EC04: Large Conversations - Truncate
  const processedTranscript = truncateTranscript(transcript);

  try {
    const client = new Anthropic({ apiKey });

    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2000,
      messages: [
        {
          role: "user",
          content: `${ANALYSIS_PROMPT}\n\n---\n\n## Conversation Transcript\n\n${processedTranscript}`,
        },
      ],
    });

    // Parse the response
    const content = response.content[0];
    if (content.type !== "text") {
      return {
        learnings: [],
        skipped: false,
      };
    }

    try {
      const result = JSON.parse(content.text);
      const today = getTodayDate();

      // Add date to each learning and validate structure
      const learnings: Learning[] = [];
      if (Array.isArray(result.learnings)) {
        for (const item of result.learnings) {
          if (
            item.confidence &&
            ["high", "medium", "low"].includes(item.confidence) &&
            item.rule &&
            item.evidence
          ) {
            learnings.push({
              confidence: item.confidence,
              rule: item.rule,
              evidence: item.evidence,
              date: today,
            });
          }
        }
      }

      return {
        learnings,
        skipped: false,
      };
    } catch {
      // JSON parse error - return empty learnings
      return {
        learnings: [],
        skipped: false,
      };
    }
  } catch (err: any) {
    // API errors shouldn't throw - return empty learnings
    return {
      learnings: [],
      skipped: true,
      skipReason: `API error: ${err.message}`,
    };
  }
}
