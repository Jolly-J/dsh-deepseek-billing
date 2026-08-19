window.__ModuleLoader__.load({
	id: "dsh-deepseek-billing",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		let react = require("react");
		let react_jsx_runtime = require("react/jsx-runtime");
		//#region \0dsh-css:/Users/Python/DSH-Plug/deepseek-harness-pr/packages/extensions/dsh-deepseek-billing/src/client/BillingPanel.module.css.mjs
		const css = "._3OBLaa_card{box-sizing:border-box;border:1px solid var(--dsw-alias-border-l2,#80808059);background:var(--dsw-specific-sidebar-fill,var(--dsw-alias-bg-layer-1,#fff));width:calc(100% - 4px);min-width:0;max-width:calc(100% - 4px);color:var(--dsw-alias-label-primary,currentColor);border-radius:12px;flex:none;margin:0 2px 8px;padding:6px 12px;font-size:12px;line-height:1.55;overflow:hidden}._3OBLaa_head{cursor:pointer;user-select:none;align-items:center;gap:4px;display:flex}._3OBLaa_headLeft{flex:0 auto;align-items:center;gap:4px;min-width:0;display:flex;overflow:hidden}._3OBLaa_spacer{flex:1 1 0;min-width:0}._3OBLaa_label{white-space:nowrap;flex:none;font-weight:700}._3OBLaa_value{white-space:nowrap;flex:none;align-items:center;display:inline-flex;overflow:hidden}._3OBLaa_valueSlot{text-align:left;white-space:nowrap;flex:none;align-items:center;width:4.2em;height:1.55em;display:inline-flex;overflow:hidden}._3OBLaa_iconBtn{color:inherit;opacity:.65;cursor:pointer;background:0 0;border:none;border-radius:4px;flex:none;align-items:center;padding:2px;font-size:12px;line-height:0;display:flex}._3OBLaa_iconBtn:hover{opacity:1;background:#8080802e}._3OBLaa_chevron{color:var(--dsw-alias-label-secondary,gray);flex:none;align-items:center;transition:transform .28s;display:flex;transform:rotate(180deg)}._3OBLaa_card._3OBLaa_expanded ._3OBLaa_chevron{transform:rotate(0)}._3OBLaa_dot{background:var(--dsw-alias-state-warn-primary,#c9a227);border-radius:50%;flex:none;width:6px;height:6px}._3OBLaa_ok{background:var(--dsw-alias-state-success-primary,#2ea44f)}._3OBLaa_err{background:var(--dsw-alias-state-error-primary,#d9534f)}._3OBLaa_body{grid-template-rows:0fr;margin-top:0;transition:grid-template-rows .28s;display:grid}._3OBLaa_card._3OBLaa_expanded ._3OBLaa_body{grid-template-rows:1fr;margin-top:8px}._3OBLaa_bodyInner{opacity:0;min-height:0;transition:opacity .22s;overflow:hidden}._3OBLaa_card._3OBLaa_expanded ._3OBLaa_bodyInner{opacity:1}._3OBLaa_scroll{max-height:42vh;overflow:hidden auto}._3OBLaa_divider{background:var(--dsw-alias-border-l1,#8080803d);height:1px;margin:8px 0 6px}._3OBLaa_row{justify-content:space-between;align-items:center;gap:8px;display:flex}._3OBLaa_k{color:var(--dsw-alias-label-secondary,gray)}._3OBLaa_errText{color:var(--dsw-alias-state-error-primary,#d9534f)}._3OBLaa_note{color:var(--dsw-alias-label-secondary,gray);margin-top:4px;font-size:10.5px}._3OBLaa_sub{color:var(--dsw-alias-label-secondary,gray);font-size:11px}._3OBLaa_nowrap{white-space:nowrap;vertical-align:middle;align-items:center;height:1.55em;display:inline-flex;overflow:hidden}._3OBLaa_roll{white-space:nowrap;vertical-align:middle;align-items:center;height:1.55em;display:inline-flex;position:relative;overflow:hidden}._3OBLaa_rollOld{height:1.55em;animation:_3OBLaa_dsb-roll-out .3s var(--ds-ease-in-out,cubic-bezier(.4, 0, .2, 1)) forwards;align-items:center;display:flex;position:absolute;top:0;right:0}._3OBLaa_rollNew{animation:_3OBLaa_dsb-roll-in .3s var(--ds-ease-in-out,cubic-bezier(.4, 0, .2, 1));display:inline-block}@keyframes _3OBLaa_dsb-roll-out{0%{opacity:1;transform:translateY(0)}to{opacity:0;transform:translateY(-100%)}}@keyframes _3OBLaa_dsb-roll-in{0%{opacity:0;transform:translateY(100%)}to{opacity:1;transform:translateY(0)}}";
		const tagId = "dsh-deepseek-billing/BillingPanel.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "dsh-deepseek-billing";
			tag.dataset.pluginCss = tagId;
			tag.textContent = css;
			document.head.appendChild(tag);
		}
		var BillingPanel_module_css_default = {
			"valueSlot": "_3OBLaa_valueSlot",
			"headLeft": "_3OBLaa_headLeft",
			"note": "_3OBLaa_note",
			"label": "_3OBLaa_label",
			"row": "_3OBLaa_row",
			"k": "_3OBLaa_k",
			"dsb-roll-out": "_3OBLaa_dsb-roll-out",
			"rollNew": "_3OBLaa_rollNew",
			"iconBtn": "_3OBLaa_iconBtn",
			"roll": "_3OBLaa_roll",
			"bodyInner": "_3OBLaa_bodyInner",
			"errText": "_3OBLaa_errText",
			"divider": "_3OBLaa_divider",
			"card": "_3OBLaa_card",
			"nowrap": "_3OBLaa_nowrap",
			"ok": "_3OBLaa_ok",
			"sub": "_3OBLaa_sub",
			"head": "_3OBLaa_head",
			"expanded": "_3OBLaa_expanded",
			"rollOld": "_3OBLaa_rollOld",
			"chevron": "_3OBLaa_chevron",
			"body": "_3OBLaa_body",
			"dsb-roll-in": "_3OBLaa_dsb-roll-in",
			"scroll": "_3OBLaa_scroll",
			"spacer": "_3OBLaa_spacer",
			"value": "_3OBLaa_value",
			"dot": "_3OBLaa_dot",
			"err": "_3OBLaa_err"
		};
		//#endregion
		//#region src/client/BillingPanel.tsx
		/**
		* The sidebar-footer billing card: a compact status row (status dot, balance,
		* session cost, refresh, expand chevron) with an animated in-flow detail body.
		* Pure flex layout — the card stays inside the official footer action area
		* and never floats over the workspace region. Numbers roll between old and
		* new values inside fixed-height slots; every other element stays put while
		* only the digits animate.
		*/
		const REFRESH_INTERVAL_MS = 6e4;
		function fmtTokens(v) {
			if (!Number.isFinite(v)) return "0";
			if (v >= 1e6) return `${(v / 1e6).toFixed(2)}M`;
			if (v >= 1e3) return `${(v / 1e3).toFixed(1)}K`;
			return String(Math.round(v));
		}
		function fmtMoney(v) {
			return Number.isFinite(v) ? v.toFixed(2) : "0.00";
		}
		function fmtCost(v) {
			if (!Number.isFinite(v) || v <= 0) return "¥0";
			if (v >= 100) return `¥${v.toFixed(2)}`;
			if (v < .01) return `¥${v.toFixed(4)}`;
			return `¥${v.toFixed(3)}`;
		}
		function fmtTime(ms) {
			try {
				return new Date(ms).toLocaleTimeString("zh-CN", { hour12: false });
			} catch (error) {
				return "";
			}
		}
		function moneyOf(b) {
			if (b === null || b === void 0) return "—";
			const symbol = b.currency === "USD" ? "$" : "¥";
			const suffix = b.currency === "USD" ? "" : "元";
			return symbol + fmtMoney(b.total) + suffix;
		}
		function balanceShort(status) {
			const data = status?.data ?? null;
			if (data === null) return "…";
			if (data.balance !== null && data.balance !== void 0) return moneyOf(data.balance);
			if (data.keyMissing === true) return "未配置 Key";
			return "—";
		}
		function costShort(status) {
			const data = status?.data ?? null;
			if (data === null) return "…";
			if (data.cost !== null && data.cost !== void 0) return fmtCost(data.cost.total);
			return "—";
		}
		function dotClass(status) {
			const data = status?.data ?? null;
			if (data !== null && data.keyMissing !== true && data.balance !== null && data.balance !== void 0) return `${BillingPanel_module_css_default.dot} ${BillingPanel_module_css_default.ok}`;
			if (data !== null && (data.keyMissing === true || typeof data.balanceError === "string")) return `${BillingPanel_module_css_default.dot} ${BillingPanel_module_css_default.err}`;
			return BillingPanel_module_css_default.dot ?? "";
		}
		/** Inline stroke icons in the web UI's 16px outline vocabulary. */
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
		function iconRefresh() {
			return svgIcon(11, /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)("polyline", { points: "23 4 23 10 17 10" }),
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)("polyline", { points: "1 20 1 14 7 14" }),
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" })
			] }));
		}
		function iconChevron() {
			return svgIcon(10, /* @__PURE__ */ (0, react_jsx_runtime.jsx)("polyline", { points: "6 15 12 9 18 15" }));
		}
		/**
		* Rolling number: the previous text rolls up and out while the new text
		* rolls in from below, both clipped inside one fixed-height line box.
		* @param props - the text to display.
		* @returns the animated value element.
		*/
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
					setDisplay((d) => ({
						current: d.current,
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
		/** Mount the compact status row with the in-flow expandable detail body. */
		function BillingPanel({ wide, useSessions }) {
			const [expanded, setExpanded] = (0, react.useState)(false);
			const [status, setStatus] = (0, react.useState)(null);
			const current = useSessions((state) => state.current);
			const sessionId = current === void 0 || current === null ? null : String(current);
			(0, react.useEffect)(() => {
				if (!wide) return void 0;
				let cancelled = false;
				const refresh = async () => {
					try {
						const data = await (await fetch(sessionId === null ? "/billing/status" : `/billing/status?sessionId=${encodeURIComponent(sessionId)}`)).json();
						if (!cancelled) setStatus({
							loading: false,
							data,
							error: null
						});
					} catch (error) {
						if (!cancelled) setStatus({
							loading: false,
							data: null,
							error: error instanceof Error ? error.message : String(error)
						});
					}
				};
				setStatus((prev) => prev === null ? {
					loading: true,
					data: null,
					error: null
				} : prev);
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
				(async () => {
					try {
						setStatus({
							loading: false,
							data: await (await fetch(sessionId === null ? "/billing/status" : `/billing/status?sessionId=${encodeURIComponent(sessionId)}`)).json(),
							error: null
						});
					} catch (error) {
						setStatus({
							loading: false,
							data: null,
							error: error instanceof Error ? error.message : String(error)
						});
					}
				})();
			};
			const bodyRows = (() => {
				const data = status?.data ?? null;
				if (status !== null && status.loading === true && data === null) return [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					className: BillingPanel_module_css_default.sub,
					children: "加载中…"
				}, "loading")];
				if (data === null) {
					const msg = status !== null && typeof status.error === "string" && status.error.length > 0 ? status.error : "未知错误";
					return [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: BillingPanel_module_css_default.errText,
						children: ["读取失败: ", msg]
					}, "error")];
				}
				const rows = [];
				if (data.keyMissing === true) rows.push(/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					className: BillingPanel_module_css_default.errText,
					children: "未配置 API Key"
				}, "missing"));
				else if (data.balance !== null && data.balance !== void 0) {
					const b = data.balance;
					const symbol = b.currency === "USD" ? "$" : "¥";
					rows.push(/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: BillingPanel_module_css_default.row,
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: BillingPanel_module_css_default.k,
							children: "充值"
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(AnimatedValue, { text: symbol + fmtMoney(b.toppedUp) })]
					}, "topped-up"), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: BillingPanel_module_css_default.row,
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: BillingPanel_module_css_default.k,
							children: "赠送"
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(AnimatedValue, { text: symbol + fmtMoney(b.granted) })]
					}, "granted"));
					if (b.available !== true) rows.push(/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: BillingPanel_module_css_default.errText,
						children: "官方标记余额不可用"
					}, "unavailable"));
				} else if (typeof data.balanceError === "string" && data.balanceError.length > 0) rows.push(/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: BillingPanel_module_css_default.errText,
					children: ["余额: ", data.balanceError]
				}, "balance-error"));
				if (data.usage !== null && data.usage !== void 0 && data.cost !== null && data.cost !== void 0) {
					const u = data.usage;
					const billedInput = u.inputTokens + u.cacheReadTokens + (u.cacheWriteTokens ?? 0);
					rows.push(/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", { className: BillingPanel_module_css_default.divider }, "divider"));
					rows.push(/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: BillingPanel_module_css_default.row,
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: BillingPanel_module_css_default.k,
							children: "输入"
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(AnimatedValue, { text: fmtTokens(billedInput) })]
					}, "input"));
					if (u.cacheReadTokens > 0) {
						const pct = billedInput > 0 ? Math.round(u.cacheReadTokens / billedInput * 100) : 0;
						rows.push(/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: BillingPanel_module_css_default.row,
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: BillingPanel_module_css_default.k,
								children: "缓存命中"
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(AnimatedValue, { text: `${fmtTokens(u.cacheReadTokens)} (${pct}%)` })]
						}, "cache-hit"));
					}
					rows.push(/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: BillingPanel_module_css_default.row,
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: BillingPanel_module_css_default.k,
							children: "输出"
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(AnimatedValue, { text: fmtTokens(u.outputTokens) })]
					}, "output"));
					if (typeof data.pricingNote === "string" && data.pricingNote.length > 0) rows.push(/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: BillingPanel_module_css_default.note,
						children: data.pricingNote
					}, "pricing"));
					rows.push(/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: BillingPanel_module_css_default.note,
						children: "费用为估算(非账单):仅计会话内成功请求,不含失败重试与余额入账延迟"
					}, "disclaimer"));
				} else if (typeof data.usageError === "string" && data.usageError.length > 0) rows.push(/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: BillingPanel_module_css_default.errText,
					children: ["用量: ", data.usageError]
				}, "usage-error"));
				if (typeof data.updatedAtMs === "number") {
					let noteText = `更新 ${fmtTime(data.updatedAtMs)}`;
					if (data.timings !== null && data.timings !== void 0 && typeof data.timings.totalMs === "number") noteText += ` · 获取 ${data.timings.totalMs}ms`;
					rows.push(/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: BillingPanel_module_css_default.note,
						children: noteText
					}, "updated"));
				}
				return rows;
			})();
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: expanded ? `${BillingPanel_module_css_default.card} ${BillingPanel_module_css_default.expanded}` : BillingPanel_module_css_default.card,
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: BillingPanel_module_css_default.head,
					role: "button",
					"aria-expanded": expanded,
					title: (expanded ? "收起 · " : "展开详情 · ") + "当前会话费用估算(非账单)",
					onClick: () => {
						setExpanded((v) => !v);
					},
					children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: BillingPanel_module_css_default.headLeft,
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { className: dotClass(status) }),
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
							children: iconRefresh()
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: BillingPanel_module_css_default.chevron,
							children: iconChevron()
						})
					]
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					className: BillingPanel_module_css_default.body,
					children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: BillingPanel_module_css_default.bodyInner,
						children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
							className: BillingPanel_module_css_default.scroll,
							children: bodyRows
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