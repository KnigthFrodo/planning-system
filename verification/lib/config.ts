/**
 * Configuration parser for .planconfig YAML files
 *
 * Reads project-specific verification commands from .planconfig in project root.
 * All commands are optional - if not configured, those verification steps are skipped.
 */

import { z } from "zod";
import * as yaml from "js-yaml";
import { existsSync, readFileSync } from "fs";
import { join } from "path";

const ConfigSchema = z.object({
  build_command: z.string().optional(),
  test_command: z.string().optional(),
  lint_command: z.string().optional(),
  format_command: z.string().optional(),
  static_analysis_command: z.string().optional(),
});

export type PlanConfig = z.infer<typeof ConfigSchema>;

export interface LoadConfigResult {
  config: PlanConfig | null;
  path: string | null;
  error: string | null;
}

/**
 * Finds and loads .planconfig from project root or current directory
 */
export function loadConfig(startDir: string = process.cwd()): LoadConfigResult {
  const configPath = findConfigFile(startDir);

  if (!configPath) {
    return { config: null, path: null, error: null };
  }

  try {
    const content = readFileSync(configPath, "utf-8");
    const parsed = yaml.load(content);
    const validated = ConfigSchema.parse(parsed || {});
    return { config: validated, path: configPath, error: null };
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return {
        config: null,
        path: configPath,
        error: `Invalid .planconfig: ${err.errors.map(e => e.message).join(", ")}`
      };
    }
    return {
      config: null,
      path: configPath,
      error: `Failed to parse .planconfig: ${err.message}`
    };
  }
}

/**
 * Searches for .planconfig starting from startDir and walking up to git root
 */
function findConfigFile(startDir: string): string | null {
  let currentDir = startDir;

  while (true) {
    const configPath = join(currentDir, ".planconfig");
    if (existsSync(configPath)) {
      return configPath;
    }

    // Check if we've reached the git root or filesystem root
    const gitDir = join(currentDir, ".git");
    if (existsSync(gitDir)) {
      // We're at git root, config not found
      return null;
    }

    const parentDir = join(currentDir, "..");
    if (parentDir === currentDir) {
      // Reached filesystem root
      return null;
    }

    currentDir = parentDir;
  }
}

/**
 * Returns the list of configured verification commands in order
 */
export function getVerificationCommands(config: PlanConfig): Array<{ name: string; command: string }> {
  const commands: Array<{ name: string; command: string }> = [];

  if (config.build_command) {
    commands.push({ name: "build", command: config.build_command });
  }
  if (config.test_command) {
    commands.push({ name: "test", command: config.test_command });
  }
  if (config.lint_command) {
    commands.push({ name: "lint", command: config.lint_command });
  }
  if (config.format_command) {
    commands.push({ name: "format", command: config.format_command });
  }
  if (config.static_analysis_command) {
    commands.push({ name: "static_analysis", command: config.static_analysis_command });
  }

  return commands;
}
