window.__ModuleLoader__.load({
	id: "dsh-deepseek-billing",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		let react = require("react");
		let react_jsx_runtime = require("react/jsx-runtime");
		//#region \0dsh-css:/Users/jolin/Documents/Codex/2026-08-14/https-mp-weixin-qq-com-s/deepseek-harness/packages/extensions/dsh-deepseek-billing/src/client/BillingPanel.module.css.mjs
		const css = ".Vb3bZq_card{box-sizing:border-box;border:1px solid var(--dsw-alias-border-l2,#80808059);background:var(--dsw-specific-sidebar-fill,var(--dsw-alias-bg-layer-1,#fff));width:calc(100% - 4px);min-width:0;max-width:calc(100% - 4px);color:var(--dsw-alias-label-primary,currentColor);border-radius:12px;flex:none;margin:0 2px 8px;padding:6px 12px;font-size:12px;line-height:1.55;overflow:hidden}.Vb3bZq_head{cursor:pointer;user-select:none;align-items:center;gap:4px;display:flex}.Vb3bZq_headLeft{flex:0 auto;align-items:center;gap:4px;min-width:0;display:flex;overflow:hidden}.Vb3bZq_spacer{flex:1 1 0;min-width:0}.Vb3bZq_label{white-space:nowrap;flex:none;font-weight:700}.Vb3bZq_value{white-space:nowrap;flex:none;align-items:center;display:inline-flex;overflow:hidden}.Vb3bZq_valueSlot{text-align:left;white-space:nowrap;flex:none;align-items:center;width:4.2em;height:1.55em;display:inline-flex;overflow:hidden}.Vb3bZq_iconBtn{color:inherit;opacity:.65;cursor:pointer;background:0 0;border:none;border-radius:4px;flex:none;align-items:center;padding:2px;font-size:12px;line-height:0;display:flex}.Vb3bZq_iconBtn:hover{opacity:1;background:#8080802e}.Vb3bZq_chevron{color:var(--dsw-alias-label-secondary,gray);flex:none;align-items:center;transition:transform .28s;display:flex;transform:rotate(180deg)}.Vb3bZq_card.Vb3bZq_expanded .Vb3bZq_chevron{transform:rotate(0)}.Vb3bZq_dot{background:var(--dsw-alias-state-warn-primary,#c9a227);border-radius:50%;flex:none;width:6px;height:6px}.Vb3bZq_ok{background:var(--dsw-alias-state-success-primary,#2ea44f)}.Vb3bZq_err{background:var(--dsw-alias-state-error-primary,#d9534f)}.Vb3bZq_body{grid-template-rows:0fr;margin-top:0;transition:grid-template-rows .28s;display:grid}.Vb3bZq_card.Vb3bZq_expanded .Vb3bZq_body{grid-template-rows:1fr;margin-top:8px}.Vb3bZq_bodyInner{opacity:0;min-height:0;transition:opacity .22s;overflow:hidden}.Vb3bZq_card.Vb3bZq_expanded .Vb3bZq_bodyInner{opacity:1}.Vb3bZq_scroll{max-height:42vh;overflow:hidden auto}.Vb3bZq_divider{background:var(--dsw-alias-border-l1,#8080803d);height:1px;margin:8px 0 6px}.Vb3bZq_row{justify-content:space-between;align-items:center;gap:8px;display:flex}.Vb3bZq_k{color:var(--dsw-alias-label-secondary,gray)}.Vb3bZq_errText{color:var(--dsw-alias-state-error-primary,#d9534f)}.Vb3bZq_note{color:var(--dsw-alias-label-secondary,gray);margin-top:4px;font-size:10.5px}.Vb3bZq_sub{color:var(--dsw-alias-label-secondary,gray);font-size:11px}.Vb3bZq_nowrap{white-space:nowrap;vertical-align:middle;align-items:center;height:1.55em;display:inline-flex;overflow:hidden}.Vb3bZq_roll{white-space:nowrap;vertical-align:middle;align-items:center;height:1.55em;display:inline-flex;position:relative;overflow:hidden}.Vb3bZq_rollOld{height:1.55em;animation:Vb3bZq_dsb-roll-out .3s var(--ds-ease-in-out,cubic-bezier(.4, 0, .2, 1)) forwards;align-items:center;display:flex;position:absolute;top:0;right:0}.Vb3bZq_rollNew{animation:Vb3bZq_dsb-roll-in .3s var(--ds-ease-in-out,cubic-bezier(.4, 0, .2, 1));display:inline-block}@keyframes Vb3bZq_dsb-roll-out{0%{opacity:1;transform:translateY(0)}to{opacity:0;transform:translateY(-100%)}}@keyframes Vb3bZq_dsb-roll-in{0%{opacity:0;transform:translateY(100%)}to{opacity:1;transform:translateY(0)}}";
		const tagId = "dsh-deepseek-billing/BillingPanel.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "dsh-deepseek-billing";
			tag.dataset.pluginCss = tagId;
			tag.textContent = css;
			document.head.appendChild(tag);
		}
		var BillingPanel_module_css_default = {
			"valueSlot": "Vb3bZq_valueSlot",
			"ok": "Vb3bZq_ok",
			"headLeft": "Vb3bZq_headLeft",
			"body": "Vb3bZq_body",
			"divider": "Vb3bZq_divider",
			"head": "Vb3bZq_head",
			"row": "Vb3bZq_row",
			"sub": "Vb3bZq_sub",
			"iconBtn": "Vb3bZq_iconBtn",
			"k": "Vb3bZq_k",
			"roll": "Vb3bZq_roll",
			"rollOld": "Vb3bZq_rollOld",
			"dsb-roll-in": "Vb3bZq_dsb-roll-in",
			"card": "Vb3bZq_card",
			"note": "Vb3bZq_note",
			"dsb-roll-out": "Vb3bZq_dsb-roll-out",
			"value": "Vb3bZq_value",
			"chevron": "Vb3bZq_chevron",
			"spacer": "Vb3bZq_spacer",
			"bodyInner": "Vb3bZq_bodyInner",
			"err": "Vb3bZq_err",
			"label": "Vb3bZq_label",
			"nowrap": "Vb3bZq_nowrap",
			"errText": "Vb3bZq_errText",
			"expanded": "Vb3bZq_expanded",
			"scroll": "Vb3bZq_scroll",
			"rollNew": "Vb3bZq_rollNew",
			"dot": "Vb3bZq_dot"
		};
		//#endregion
		//#region src/client/AnimatedValue.tsx
		/** Roll changed text through one fixed-height line box. */
		function AnimatedValue({ text }) {
			const [display, setDisplay] = (0, react.useState)({
				current: text,
				previous: null
			});
			(0, react.useEffect)(() => {
				if (text === display.current) return void 0;
				setDisplay({
					current: text,
					previous: display.current
				});
				const timer = window.setTimeout(() => {
					setDisplay((value) => ({
						current: value.current,
						previous: null
					}));
				}, 340);
				return () => {
					window.clearTimeout(timer);
				};
			}, [text]);
			if (display.previous === null) return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
				className: BillingPanel_module_css_default.nowrap,
				children: text
			});
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
				className: BillingPanel_module_css_default.roll,
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
					className: BillingPanel_module_css_default.rollOld,
					children: display.previous
				}, "old"), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
					className: BillingPanel_module_css_default.rollNew,
					children: display.current
				}, "new")]
			});
		}
		//#endregion
		//#region src/client/api.ts
		/** Load the account and optional session totals from the node half. */
		async function loadBillingStatus(sessionId) {
			const endpoint = sessionId === null ? "/billing/status" : `/billing/status?sessionId=${encodeURIComponent(sessionId)}`;
			return (await fetch(endpoint)).json();
		}
		/** Convert an unknown rejection into the user-visible error string. */
		function errorMessage(error) {
			return error instanceof Error ? error.message : String(error);
		}
		//#endregion
		//#region src/client/format.ts
		function fmtTokens(value) {
			if (!Number.isFinite(value)) return "0";
			if (value >= 1e6) return `${(value / 1e6).toFixed(2)}M`;
			if (value >= 1e3) return `${(value / 1e3).toFixed(1)}K`;
			return String(Math.round(value));
		}
		function fmtMoney(value) {
			return Number.isFinite(value) ? value.toFixed(2) : "0.00";
		}
		function fmtCost(value) {
			if (!Number.isFinite(value) || value <= 0) return "¥0";
			if (value >= 100) return `¥${value.toFixed(2)}`;
			if (value < .01) return `¥${value.toFixed(4)}`;
			return `¥${value.toFixed(3)}`;
		}
		function fmtTime(timeMs) {
			try {
				return new Date(timeMs).toLocaleTimeString("zh-CN", { hour12: false });
			} catch {
				return "";
			}
		}
		function moneyOf(balance) {
			if (balance === null || balance === void 0) return "—";
			const symbol = balance.currency === "USD" ? "$" : "¥";
			const suffix = balance.currency === "USD" ? "" : "元";
			return symbol + fmtMoney(balance.total) + suffix;
		}
		function balanceShort(status) {
			const data = status?.data ?? null;
			if (data === null) return "…";
			if (data.balance !== null) return moneyOf(data.balance);
			return data.keyMissing ? "未配置 Key" : "—";
		}
		function costShort(status) {
			const data = status?.data ?? null;
			if (data === null) return "…";
			return data.cost === null ? "—" : fmtCost(data.cost.total);
		}
		function statusKind(status) {
			const data = status?.data ?? null;
			if (data !== null && !data.keyMissing && data.balance !== null) return "ok";
			if (data !== null && (data.keyMissing || typeof data.balanceError === "string")) return "error";
			return "idle";
		}
		//#endregion
		//#region src/client/BillingDetails.tsx
		/** Render the expanded balance, token, pricing, and timing rows. */
		function BillingDetails({ status }) {
			const data = status?.data ?? null;
			if (status?.loading === true && data === null) return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				className: BillingPanel_module_css_default.sub,
				children: "加载中…"
			});
			if (data === null) {
				const message = status?.error !== null && status?.error !== void 0 && status.error.length > 0 ? status.error : "未知错误";
				return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: BillingPanel_module_css_default.errText,
					children: ["读取失败: ", message]
				});
			}
			const balanceRows = [];
			if (data.keyMissing) balanceRows.push(/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				className: BillingPanel_module_css_default.errText,
				children: "未配置 API Key"
			}, "missing"));
			else if (data.balance !== null) {
				const symbol = data.balance.currency === "USD" ? "$" : "¥";
				balanceRows.push(/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: BillingPanel_module_css_default.row,
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						className: BillingPanel_module_css_default.k,
						children: "充值"
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(AnimatedValue, { text: symbol + fmtMoney(data.balance.toppedUp) })]
				}, "topped-up"), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: BillingPanel_module_css_default.row,
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						className: BillingPanel_module_css_default.k,
						children: "赠送"
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(AnimatedValue, { text: symbol + fmtMoney(data.balance.granted) })]
				}, "granted"));
				if (!data.balance.available) balanceRows.push(/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					className: BillingPanel_module_css_default.errText,
					children: "官方标记余额不可用"
				}, "unavailable"));
			} else if (typeof data.balanceError === "string" && data.balanceError.length > 0) balanceRows.push(/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: BillingPanel_module_css_default.errText,
				children: ["余额: ", data.balanceError]
			}, "balance-error"));
			const usageRows = [];
			if (data.usage !== null && data.cost !== null) {
				const billedInput = data.usage.inputTokens + data.usage.cacheReadTokens + (data.usage.cacheWriteTokens ?? 0);
				usageRows.push(/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", { className: BillingPanel_module_css_default.divider }, "divider"));
				usageRows.push(/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: BillingPanel_module_css_default.row,
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						className: BillingPanel_module_css_default.k,
						children: "输入"
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(AnimatedValue, { text: fmtTokens(billedInput) })]
				}, "input"));
				if (data.usage.cacheReadTokens > 0) {
					const percentage = billedInput > 0 ? Math.round(data.usage.cacheReadTokens / billedInput * 100) : 0;
					usageRows.push(/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: BillingPanel_module_css_default.row,
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: BillingPanel_module_css_default.k,
							children: "缓存命中"
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(AnimatedValue, { text: `${fmtTokens(data.usage.cacheReadTokens)} (${percentage}%)` })]
					}, "cache-hit"));
				}
				usageRows.push(/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: BillingPanel_module_css_default.row,
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						className: BillingPanel_module_css_default.k,
						children: "输出"
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(AnimatedValue, { text: fmtTokens(data.usage.outputTokens) })]
				}, "output"));
				if (data.pricingNote.length > 0) usageRows.push(/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					className: BillingPanel_module_css_default.note,
					children: data.pricingNote
				}, "pricing"));
				usageRows.push(/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					className: BillingPanel_module_css_default.note,
					children: "费用为估算(非账单):仅计会话内成功请求,不含失败重试与余额入账延迟"
				}, "disclaimer"));
			} else if (typeof data.usageError === "string" && data.usageError.length > 0) usageRows.push(/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: BillingPanel_module_css_default.errText,
				children: ["用量: ", data.usageError]
			}, "usage-error"));
			let timingText = `更新 ${fmtTime(data.updatedAtMs)}`;
			if (data.timings !== null) timingText += ` · 获取 ${data.timings.totalMs}ms`;
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [
				balanceRows,
				usageRows,
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					className: BillingPanel_module_css_default.note,
					children: timingText
				})
			] });
		}
		//#endregion
		//#region src/client/icons.tsx
		function svgIcon(size, children) {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("svg", {
				width: size,
				height: size,
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: 2,
				strokeLinecap: "round",
				strokeLinejoin: "round",
				"aria-hidden": true,
				children
			});
		}
		function RefreshIcon() {
			return svgIcon(11, /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)("polyline", { points: "23 4 23 10 17 10" }),
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)("polyline", { points: "1 20 1 14 7 14" }),
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" })
			] }));
		}
		function ChevronIcon() {
			return svgIcon(10, /* @__PURE__ */ (0, react_jsx_runtime.jsx)("polyline", { points: "6 15 12 9 18 15" }));
		}
		//#endregion
		//#region src/client/BillingPanel.tsx
		/** Compact DeepSeek balance and session-cost card for the official sidebar footer. */
		const REFRESH_INTERVAL_MS = 6e4;
		/** Mount the compact status row with the in-flow expandable detail body. */
		function BillingPanel({ wide, useSessions }) {
			const [expanded, setExpanded] = (0, react.useState)(false);
			const [status, setStatus] = (0, react.useState)(null);
			const currentSession = useSessions((state) => state.current);
			const sessionId = currentSession === void 0 ? null : String(currentSession);
			(0, react.useEffect)(() => {
				if (!wide) return void 0;
				let cancelled = false;
				const refresh = async () => {
					try {
						const data = await loadBillingStatus(sessionId);
						if (!cancelled) setStatus({
							loading: false,
							data,
							error: null
						});
					} catch (error) {
						if (!cancelled) setStatus({
							loading: false,
							data: null,
							error: errorMessage(error)
						});
					}
				};
				setStatus((previous) => previous ?? {
					loading: true,
					data: null,
					error: null
				});
				refresh();
				const interval = window.setInterval(() => {
					refresh();
				}, REFRESH_INTERVAL_MS);
				return () => {
					cancelled = true;
					window.clearInterval(interval);
				};
			}, [sessionId, wide]);
			if (!wide) return null;
			const refreshNow = () => {
				loadBillingStatus(sessionId).then((data) => {
					setStatus({
						loading: false,
						data,
						error: null
					});
				}, (error) => {
					setStatus({
						loading: false,
						data: null,
						error: errorMessage(error)
					});
				});
			};
			const kind = statusKind(status);
			const dotClass = kind === "ok" ? `${BillingPanel_module_css_default.dot} ${BillingPanel_module_css_default.ok}` : kind === "error" ? `${BillingPanel_module_css_default.dot} ${BillingPanel_module_css_default.err}` : BillingPanel_module_css_default.dot;
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: expanded ? `${BillingPanel_module_css_default.card} ${BillingPanel_module_css_default.expanded}` : BillingPanel_module_css_default.card,
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: BillingPanel_module_css_default.head,
					role: "button",
					"aria-expanded": expanded,
					title: (expanded ? "收起 · " : "展开详情 · ") + "当前会话费用估算(非账单)",
					onClick: () => {
						setExpanded((value) => !value);
					},
					children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: BillingPanel_module_css_default.headLeft,
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { className: dotClass }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									className: BillingPanel_module_css_default.label,
									children: "余额:"
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									className: BillingPanel_module_css_default.value,
									children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(AnimatedValue, { text: balanceShort(status) })
								})
							]
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { className: BillingPanel_module_css_default.spacer }),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: BillingPanel_module_css_default.label,
							title: "当前会话费用估算(非账单)",
							children: "会话:"
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: BillingPanel_module_css_default.valueSlot,
							children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(AnimatedValue, { text: costShort(status) })
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
							type: "button",
							className: BillingPanel_module_css_default.iconBtn,
							title: "刷新",
							onClick: (event) => {
								event.stopPropagation();
								refreshNow();
							},
							children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(RefreshIcon, {})
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: BillingPanel_module_css_default.chevron,
							children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(ChevronIcon, {})
						})
					]
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					className: BillingPanel_module_css_default.body,
					children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: BillingPanel_module_css_default.bodyInner,
						children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
							className: BillingPanel_module_css_default.scroll,
							children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(BillingDetails, { status })
						})
					})
				})]
			});
		}
		//#endregion
		//#region src/client/index.ts
		/** Required services for the sidebar-footer registration. */
		const inject = ["slots"];
		/** Mount the billing card into the official sidebar footer action area. */
		function apply(ctx) {
			ctx.slots.inject("sidebar.footer.action", () => ctx.slots.register({
				name: "sidebar.footer.action",
				id: "deepseek-billing",
				order: 10,
				label: "余额"
			}, BillingPanel));
		}
		//#endregion
		exports.apply = apply;
		exports.inject = inject;
		return module.exports;
	}
});

//# sourceMappingURL=client.js.map