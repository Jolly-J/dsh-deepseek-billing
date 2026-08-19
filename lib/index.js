//#region lib/types/balance.js
function money(value) {
	const parsed = Number(value);
	return Number.isFinite(parsed) ? parsed : 0;
}
function parseBalance(text) {
	const parsed = JSON.parse(text);
	const infos = Array.isArray(parsed.balance_infos) ? parsed.balance_infos : [];
	const info = infos.find((candidate) => candidate !== null && typeof candidate === "object" && candidate.currency === "CNY") ?? infos[0] ?? null;
	if (info === null || typeof info !== "object") return null;
	return {
		currency: typeof info.currency === "string" ? info.currency : "CNY",
		total: money(info.total_balance),
		granted: money(info.granted_balance),
		toppedUp: money(info.topped_up_balance),
		available: parsed.is_available !== false
	};
}
/** Fetch the DeepSeek account balance without exposing the credential on argv. */
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
			const balance = parseBalance(text);
			return balance === null ? {
				keyMissing: false,
				balance: null,
				balanceError: "余额接口未返回 balance_infos"
			} : {
				keyMissing: false,
				balance,
				balanceError: null
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
//#endregion
//#region lib/types/pricing.js
/** Price table changed at 2026-08-17 00:00 China Standard Time. */
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
/** Classify a model id into the two DeepSeek V4 billing families. */
function modelKey(modelId) {
	if (modelId.length === 0) return "pro";
	return modelId.toLowerCase().includes("flash") ? "flash" : "pro";
}
function modelName(modelId) {
	return modelKey(modelId) === "flash" ? "DeepSeek-V4-Flash" : "DeepSeek-V4-Pro";
}
/** Resolve the China Standard Time peak/off-peak tier for one timestamp. */
function tierAt(timeMs) {
	const hour = (new Date(timeMs ?? Date.now()).getUTCHours() + 8) % 24;
	return hour >= 9 && hour < 12 || hour >= 14 && hour < 18 ? "peak" : "offPeak";
}
/** Resolve the exact input/output rates that apply to one model request. */
function priceOf(modelId, timeMs) {
	const table = modelKey(modelId) === "flash" ? FLASH_TABLE : PRO_TABLE;
	const timestamp = timeMs ?? Date.now();
	if (timestamp < NEW_PRICE_EFFECTIVE_MS) return {
		...table.old,
		tier: "flat"
	};
	const tier = tierAt(timestamp);
	return {
		...table[tier],
		tier
	};
}
/** Render the compact price explanation shown in the expanded card. */
function pricingNote(modelId, timeMs) {
	const price = priceOf(modelId, timeMs);
	const when = price.tier === "flat" ? "旧价表" : price.tier === "peak" ? "高峰时段" : "空闲时段";
	return `${modelName(modelId)} · ${when} · 命中${price.hit}/未命中${price.miss}/输出${price.out} 元/M`;
}
//#endregion
//#region lib/types/usage.js
function positiveNumber(value) {
	const parsed = Number(value);
	return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
}
/** Fold successful assistant-message usage into disjoint token and cost buckets. */
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
		const event = raw;
		if (event.type !== "assistant/message" || event.data === null || typeof event.data !== "object") continue;
		const data = event.data;
		if (data.usage === null || typeof data.usage !== "object") continue;
		const usageSource = data.usage;
		const model = typeof data.message?.source?.model === "string" && data.message.source.model.length > 0 ? data.message.source.model : "unknown";
		const input = positiveNumber(usageSource.inputTokens);
		const cacheRead = positiveNumber(usageSource.cacheReadTokens);
		const output = positiveNumber(usageSource.outputTokens);
		const reasoning = positiveNumber(usageSource.reasoningTokens);
		usage.inputTokens += input;
		usage.cacheReadTokens += cacheRead;
		usage.outputTokens += output;
		usage.reasoningTokens += reasoning;
		lastModel = model;
		const price = priceOf(model, typeof event.time === "number" ? event.time : void 0);
		inputCost += (input * price.miss + cacheRead * price.hit) / 1e6;
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
		pricingNote: lastModel === null ? "" : pricingNote(lastModel)
	};
}
//#endregion
//#region lib/types/status-route.js
const BALANCE_TTL_MS = 3e4;
function emptyUsage(overrides) {
	return {
		...overrides,
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
function resolveProviderSettings(ctx) {
	const settings = ctx.get("settings");
	let apiKeyEnv = "DEEPSEEK_API_KEY";
	let baseURL = "https://api.deepseek.com";
	if (settings === void 0) return {
		apiKeyEnv,
		baseURL
	};
	try {
		const section = settings.get("llm-deepseek");
		if (section !== null && typeof section === "object") {
			const apiKeyEnvValue = section.apiKeyEnv;
			const baseURLValue = section.baseURL;
			if (typeof apiKeyEnvValue === "string" && apiKeyEnvValue.length > 0) apiKeyEnv = apiKeyEnvValue;
			if (typeof baseURLValue === "string" && baseURLValue.length > 0) baseURL = baseURLValue;
		}
	} catch {}
	return {
		apiKeyEnv,
		baseURL
	};
}
async function resolveCredential(ctx, apiKeyEnv) {
	const credentials = ctx.get("credentials");
	if (credentials === void 0) return null;
	try {
		const hit = await credentials.resolve(apiKeyEnv);
		return hit !== void 0 && hit.value.length > 0 ? hit.value : null;
	} catch {
		return null;
	}
}
async function loadUsage(ctx, sessionId) {
	if (sessionId === null) return emptyUsage({
		skip: true,
		error: null,
		usageMs: 0
	});
	const start = Date.now();
	const sessions = ctx.get("sessions");
	if (sessions !== void 0) try {
		const session = sessions.get(sessionId);
		if (session !== void 0 && Array.isArray(session.events)) return {
			skip: false,
			...foldUsage(session.events),
			error: null,
			usageMs: Date.now() - start
		};
	} catch {}
	const sessionQuery = ctx.get("sessionQuery");
	if (sessionQuery === void 0) return emptyUsage({
		skip: false,
		error: "sessionQuery 服务不可用",
		usageMs: Date.now() - start
	});
	try {
		const log = await sessionQuery.readSession(sessionId);
		return {
			skip: false,
			...foldUsage(log !== null && log !== void 0 && Array.isArray(log.events) ? log.events : []),
			error: null,
			usageMs: Date.now() - start
		};
	} catch (error) {
		return emptyUsage({
			skip: false,
			error: error instanceof Error ? error.message : String(error),
			usageMs: Date.now() - start
		});
	}
}
/** Register the exact status endpoint and its request-local aggregation flow. */
function registerBillingStatusRoute(ctx) {
	let balanceCache = null;
	return ctx.webServer.register({
		kind: "exact",
		path: "/billing/status",
		handler: async (req, res) => {
			const totalStart = Date.now();
			try {
				const requestedSessionId = new URL(req.url ?? "/", "http://localhost").searchParams.get("sessionId");
				const sessionId = requestedSessionId !== null && requestedSessionId.length > 0 ? requestedSessionId : null;
				const { apiKeyEnv, baseURL } = resolveProviderSettings(ctx);
				const apiKey = await resolveCredential(ctx, apiKeyEnv);
				const balanceTask = (async () => {
					const start = Date.now();
					const now = Date.now();
					if (balanceCache !== null && now - balanceCache.atMs < BALANCE_TTL_MS) return {
						...balanceCache.value,
						balanceMs: Date.now() - start
					};
					const value = await fetchBalance(ctx, apiKey, apiKeyEnv, baseURL);
					balanceCache = {
						atMs: now,
						value
					};
					return {
						...value,
						balanceMs: Date.now() - start
					};
				})();
				const [balance, usage] = await Promise.all([balanceTask, loadUsage(ctx, sessionId)]);
				const output = {
					ok: !balance.keyMissing,
					keyMissing: balance.keyMissing,
					balance: balance.balance,
					balanceError: balance.balanceError,
					usage: usage.skip ? null : usage.usage,
					usageError: usage.skip ? null : usage.error,
					cost: usage.skip ? null : usage.cost,
					sessionId,
					model: usage.skip ? null : usage.model,
					pricingNote: usage.skip ? "" : usage.pricingNote,
					timings: {
						balanceMs: balance.balanceMs,
						usageMs: usage.usageMs,
						totalMs: Date.now() - totalStart
					},
					updatedAtMs: Date.now()
				};
				res.statusCode = 200;
				res.setHeader("Content-Type", "application/json; charset=utf-8");
				res.end(JSON.stringify(output));
			} catch (error) {
				res.statusCode = 500;
				res.setHeader("Content-Type", "application/json; charset=utf-8");
				res.end(JSON.stringify({ error: error instanceof Error ? error.message : String(error) }));
			}
		}
	});
}
//#endregion
//#region lib/types/index.js
/** Stable Cordis plugin name. */
const name = "ui-deepseek-billing";
/** Service required before the status route can be claimed. */
const inject = ["webServer"];
/** Register the browser-facing billing status endpoint. */
function apply(ctx) {
	ctx.effect(() => registerBillingStatusRoute(ctx), "ui-deepseek-billing: status route");
}
//#endregion
export { apply, inject, name };
