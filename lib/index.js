import { credentialRef } from "@deepseek-ai/dsh-credentials";
//#region lib/types/index.js
/**
* DeepSeek account balance and per-session cost estimate, node half.
*
* Serves one exact JSON endpoint, `/billing/status`, for the browser half:
* the caller session's token-usage fold (live in-memory events when the
* session is open, the persisted log otherwise) plus the provider balance
* fetched with the model route's own credential. Request-local state only,
* except the 30-second balance cache.
* @module dsh-deepseek-billing
*/
/** Stable Cordis plugin name. */
const name = "ui-deepseek-billing";
/** Service required before the status route can be claimed. */
const inject = ["webServer"];
/** Official pricing (RMB per million tokens). Source: https://api-docs.deepseek.com/zh-cn/quick_start/pricing/ */
const NEW_PRICE_EFFECTIVE_MS = (/* @__PURE__ */ new Date("2026-08-16T16:00:00Z")).getTime();
const FLASH_TABLE = {
	old: {
		hit: .02,
		miss: 1,
		out: 2
	},
	offPeak: {
		hit: .05,
		miss: 1.5,
		out: 4.5
	},
	peak: {
		hit: .1,
		miss: 3,
		out: 9
	}
};
const PRO_TABLE = {
	old: {
		hit: .025,
		miss: 3,
		out: 6
	},
	offPeak: {
		hit: .15,
		miss: 4.5,
		out: 13.5
	},
	peak: {
		hit: .3,
		miss: 9,
		out: 27
	}
};
function modelKey(modelId) {
	if (modelId.length === 0) return "pro";
	return modelId.toLowerCase().includes("flash") ? "flash" : "pro";
}
function modelName(modelId) {
	return modelKey(modelId) === "flash" ? "DeepSeek-V4-Flash" : "DeepSeek-V4-Pro";
}
function tierAt(timeMs) {
	const hour = (new Date(timeMs ?? Date.now()).getUTCHours() + 8) % 24;
	return hour >= 9 && hour < 12 || hour >= 14 && hour < 18 ? "peak" : "offPeak";
}
function priceOf(modelId, timeMs) {
	const table = modelKey(modelId) === "flash" ? FLASH_TABLE : PRO_TABLE;
	const t = timeMs ?? Date.now();
	if (t < NEW_PRICE_EFFECTIVE_MS) return {
		hit: table.old.hit,
		miss: table.old.miss,
		out: table.old.out,
		tier: "flat"
	};
	const tier = tierAt(t);
	const p = table[tier];
	return {
		hit: p.hit,
		miss: p.miss,
		out: p.out,
		tier
	};
}
function pricingNote(modelId, timeMs) {
	const p = priceOf(modelId, timeMs);
	const when = p.tier === "flat" ? "旧价表" : p.tier === "peak" ? "高峰时段" : "空闲时段";
	return `${modelName(modelId)} · ${when} · 命中${p.hit}/未命中${p.miss}/输出${p.out} 元/M`;
}
function num(v) {
	const n = Number(v);
	return Number.isFinite(n) && n > 0 ? n : 0;
}
function money(v) {
	const n = Number(v);
	return Number.isFinite(n) ? n : 0;
}
/** Disjoint buckets plus per-event-time pricing over one event list. */
function foldUsage(events) {
	const usage = {
		inputTokens: 0,
		cacheReadTokens: 0,
		outputTokens: 0,
		reasoningTokens: 0
	};
	let inputCost = 0;
	let outputCost = 0;
	let lastModel = null;
	for (const raw of events) {
		if (raw === null || typeof raw !== "object") continue;
		const ev = raw;
		if (ev.type !== "assistant/message") continue;
		const data = ev.data;
		if (data === null || typeof data !== "object") continue;
		const u = data.usage;
		if (u === null || typeof u !== "object") continue;
		const src = data.message?.source;
		const model = typeof src?.model === "string" && src.model.length > 0 ? src.model : "unknown";
		lastModel = model;
		const input = num(u.inputTokens);
		const hitTokens = num(u.cacheReadTokens);
		const output = num(u.outputTokens);
		const reasoning = num(u.reasoningTokens);
		usage.inputTokens += input;
		usage.cacheReadTokens += hitTokens;
		usage.outputTokens += output;
		usage.reasoningTokens += reasoning;
		const price = priceOf(model, typeof ev.time === "number" ? ev.time : void 0);
		inputCost += (input * price.miss + hitTokens * price.hit) / 1e6;
		outputCost += output * price.out / 1e6;
	}
	return {
		usage,
		cost: {
			input: inputCost,
			output: outputCost,
			total: inputCost + outputCost
		},
		model: lastModel,
		pricingNote: lastModel !== null ? pricingNote(lastModel) : ""
	};
}
async function fetchBalance(ctx, apiKey, apiKeyEnv, baseURL) {
	if (apiKey === null) return {
		keyMissing: true,
		balance: null,
		balanceError: `未找到 API Key(${apiKeyEnv})`
	};
	const shell = ctx.get("shell");
	if (shell === void 0) return {
		keyMissing: false,
		balance: null,
		balanceError: "shell 服务不可用"
	};
	try {
		const endpoint = baseURL.replace(/\/+$/, "") + "/user/balance";
		const spec = shell.resolve({
			command: `curl -sS --max-time 20 -H "Authorization: Bearer $DEEPSEEK_API_KEY" "${endpoint}"`,
			env: { DEEPSEEK_API_KEY: apiKey },
			timeoutMs: 25e3,
			stdoutMaxBytes: 65536
		});
		const run = await shell.run(spec);
		const text = typeof run.stdout?.text === "string" ? run.stdout.text.trim() : "";
		if (run.exitCode === 0 && text.length > 0) {
			const parsed = JSON.parse(text);
			const infos = Array.isArray(parsed.balance_infos) ? parsed.balance_infos : [];
			const info = infos.find((b) => b !== null && typeof b === "object" && b.currency === "CNY") ?? infos[0] ?? null;
			if (info !== null && typeof info === "object") return {
				keyMissing: false,
				balance: {
					currency: typeof info.currency === "string" ? info.currency : "CNY",
					total: money(info.total_balance),
					granted: money(info.granted_balance),
					toppedUp: money(info.topped_up_balance),
					available: parsed.is_available !== false
				},
				balanceError: null
			};
			return {
				keyMissing: false,
				balance: null,
				balanceError: "余额接口未返回 balance_infos"
			};
		}
		return {
			keyMissing: false,
			balance: null,
			balanceError: `请求失败: ${typeof run.stderr?.text === "string" && run.stderr.text.length > 0 ? run.stderr.text.trim() : `exit=${String(run.exitCode)}`}`
		};
	} catch (error) {
		return {
			keyMissing: false,
			balance: null,
			balanceError: error instanceof Error ? error.message : String(error)
		};
	}
}
function apply(ctx) {
	const BALANCE_TTL_MS = 3e4;
	let balanceCache = null;
	ctx.effect(() => ctx.webServer.register({
		kind: "exact",
		path: "/billing/status",
		handler: async (req, res) => {
			const totalStart = Date.now();
			try {
				const sessionIdParam = new URL(req.url ?? "/", "http://localhost").searchParams.get("sessionId");
				const sessionId = sessionIdParam !== null && sessionIdParam.length > 0 ? sessionIdParam : null;
				const settings = ctx.get("settings");
				let apiKeyEnv = "DEEPSEEK_API_KEY";
				let baseURL = "https://api.deepseek.com";
				if (settings !== void 0) try {
					const section = settings.get("llm-deepseek");
					if (section !== null && typeof section === "object") {
						const apiKeyEnvValue = section.apiKeyEnv;
						const baseURLValue = section.baseURL;
						if (typeof apiKeyEnvValue === "string" && apiKeyEnvValue.length > 0) apiKeyEnv = apiKeyEnvValue;
						if (typeof baseURLValue === "string" && baseURLValue.length > 0) baseURL = baseURLValue;
					}
				} catch (error) {}
				const credentials = ctx.get("credentials");
				let apiKey = null;
				if (credentials !== void 0) try {
					const hit = await credentials.resolve(credentialRef(apiKeyEnv));
					if (hit !== void 0 && hit.value.length > 0) apiKey = hit.value;
				} catch (error) {}
				const balanceTask = (async () => {
					const t0 = Date.now();
					const now = Date.now();
					if (balanceCache !== null && now - balanceCache.atMs < BALANCE_TTL_MS) return {
						...balanceCache.value,
						balanceMs: Date.now() - t0
					};
					const value = await fetchBalance(ctx, apiKey, apiKeyEnv, baseURL);
					balanceCache = {
						atMs: now,
						value
					};
					return {
						...value,
						balanceMs: Date.now() - t0
					};
				})();
				const usageTask = (async () => {
					if (sessionId === null) return {
						skip: true,
						error: null,
						usageMs: 0,
						usage: {
							inputTokens: 0,
							cacheReadTokens: 0,
							outputTokens: 0,
							reasoningTokens: 0
						},
						cost: {
							input: 0,
							output: 0,
							total: 0
						},
						model: null,
						pricingNote: ""
					};
					const t0 = Date.now();
					const sessions = ctx.get("sessions");
					if (sessions !== void 0) try {
						const session = sessions.get(sessionId);
						if (session !== void 0 && Array.isArray(session.events)) return {
							skip: false,
							...foldUsage(session.events),
							error: null,
							usageMs: Date.now() - t0
						};
					} catch (error) {}
					const sessionQuery = ctx.get("sessionQuery");
					if (sessionQuery === void 0) return {
						skip: false,
						error: "sessionQuery 服务不可用",
						usageMs: Date.now() - t0,
						usage: {
							inputTokens: 0,
							cacheReadTokens: 0,
							outputTokens: 0,
							reasoningTokens: 0
						},
						cost: {
							input: 0,
							output: 0,
							total: 0
						},
						model: null,
						pricingNote: ""
					};
					try {
						const log = await sessionQuery.readSession(sessionId);
						return {
							skip: false,
							...foldUsage(log !== null && log !== void 0 && Array.isArray(log.events) ? log.events : []),
							error: null,
							usageMs: Date.now() - t0
						};
					} catch (error) {
						return {
							skip: false,
							error: error instanceof Error ? error.message : String(error),
							usageMs: Date.now() - t0,
							usage: {
								inputTokens: 0,
								cacheReadTokens: 0,
								outputTokens: 0,
								reasoningTokens: 0
							},
							cost: {
								input: 0,
								output: 0,
								total: 0
							},
							model: null,
							pricingNote: ""
						};
					}
				})();
				const [balanceRes, usageRes] = await Promise.all([balanceTask, usageTask]);
				const out = {
					ok: !balanceRes.keyMissing,
					keyMissing: balanceRes.keyMissing,
					balance: balanceRes.balance,
					balanceError: balanceRes.balanceError,
					usage: usageRes.skip ? null : usageRes.usage,
					usageError: usageRes.skip ? null : usageRes.error,
					cost: usageRes.skip ? null : usageRes.cost,
					sessionId,
					model: usageRes.skip ? null : usageRes.model,
					pricingNote: usageRes.skip ? "" : usageRes.pricingNote,
					timings: {
						balanceMs: balanceRes.balanceMs,
						usageMs: usageRes.usageMs,
						totalMs: Date.now() - totalStart
					},
					updatedAtMs: Date.now()
				};
				res.statusCode = 200;
				res.setHeader("Content-Type", "application/json; charset=utf-8");
				res.end(JSON.stringify(out));
			} catch (error) {
				res.statusCode = 500;
				res.setHeader("Content-Type", "application/json; charset=utf-8");
				res.end(JSON.stringify({ error: error instanceof Error ? error.message : String(error) }));
			}
		}
	}), "ui-deepseek-billing: status route");
}
//#endregion
export { apply, inject, name };
