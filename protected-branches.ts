/**
 * Protected Branches Extension
 *
 * Blocks git push and git commit on protected branches (main, master, production).
 */

import type { ExtensionAPI } from "@mariozechner/pi-coding-agent";
import { isToolCallEventType } from "@mariozechner/pi-coding-agent";

export default function (pi: ExtensionAPI) {
	const protectedBranches = ["main", "master", "production"];
	const branchPattern = protectedBranches.join("|");

	const patterns: { pattern: RegExp; action: string }[] = [
		{ pattern: /\bgit\s+commit\b/, action: "commit" },
		{ pattern: new RegExp(`\\bgit\\s+push\\b.*\\b(${branchPattern})\\b`), action: "push to" },
	];

	const matchProtected = (command: string): { action: string; branch: string } | null => {
		const normalized = command.replace(/\s+/g, " ").trim();
		for (const { pattern, action } of patterns) {
			const match = normalized.match(pattern);
			if (match) {
				return { action, branch: match[1] ?? "protected branch" };
			}
		}
		return null;
	};

	pi.on("tool_call", async (event, ctx) => {
		if (!isToolCallEventType("bash", event)) return undefined;

		const match = matchProtected(event.input.command);
		if (!match) return undefined;

		if (ctx.hasUI) {
			const allow = await ctx.ui.confirm(
				"Protected Branch",
				`This will ${match.action} '${match.branch}'. Are you sure?`
			);
			if (allow) return undefined;
		}

		return { block: true, reason: `Blocked git ${match.action} '${match.branch}'` };
	});

	pi.on("user_bash", (event, ctx) => {
		const match = matchProtected(event.command);
		if (match && ctx.hasUI) {
			ctx.ui.notify(`⚠️  About to ${match.action} '${match.branch}' — be careful!`, "warning");
		}
		return undefined;
	});

	pi.on("session_start", async (_event, ctx) => {
		if (ctx.hasUI) {
			ctx.ui.notify("Protected branches: main, master, production", "info");
		}
	});
}
