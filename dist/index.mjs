import { jwtDecode } from "jwt-decode";
import { create } from "zustand";
import React, { useEffect, useRef } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { createPortal } from "react-dom";
//#region src/jwt-auth/tokenStore.ts
const DEFAULT_KEYS = {
	access: "access_token",
	refresh: "refresh_token"
};
function createTokenStore(storage = localStorage, keys) {
	const k = {
		...DEFAULT_KEYS,
		...keys ?? {}
	};
	return {
		setAccessToken(token) {
			storage.setItem(k.access, token);
		},
		getAccessToken() {
			return storage.getItem(k.access);
		},
		clearAccessToken() {
			storage.removeItem(k.access);
		},
		setRefreshToken(token) {
			storage.setItem(k.refresh, token);
		},
		getRefreshToken() {
			return storage.getItem(k.refresh);
		},
		clearRefreshToken() {
			storage.removeItem(k.refresh);
		},
		clearAll() {
			storage.removeItem(k.access);
			storage.removeItem(k.refresh);
		},
		keys: k
	};
}
//#endregion
//#region src/jwt-auth/jwt.ts
function isTokenExpired(token) {
	const decoded = jwtDecode(token);
	const now = Math.round(Date.now() / 1e3);
	return !decoded?.exp || now >= decoded.exp;
}
//#endregion
//#region src/jwt-auth/refresh.ts
async function exchangeRefreshToken(axios, refreshToken, endpoint = "/token/exchange") {
	const response = await axios.post(endpoint, {}, { headers: {
		"Content-Type": "application/json",
		Authorization: `Bearer ${refreshToken}`
	} });
	if (!response?.data?.accessToken || !response?.data?.refreshToken) throw new Error("Token exchange did not return accessToken/refreshToken");
	return response.data;
}
//#endregion
//#region src/jwt-auth/client.ts
function createAuthClient(options) {
	const { axiosPublic, axiosAuth, onLogout, storage = localStorage, keys, refreshEndpoint = "/token/exchange" } = options;
	const store = createTokenStore(storage, keys);
	let refreshInFlight = null;
	async function getOrRefreshAccessToken() {
		let access = store.getAccessToken();
		if (access && !isTokenExpired(access)) return access;
		const refresh = store.getRefreshToken();
		if (!refresh) return null;
		if (!refreshInFlight) refreshInFlight = (async () => {
			const data = await exchangeRefreshToken(axiosPublic, refresh, refreshEndpoint);
			store.setAccessToken(data.accessToken);
			store.setRefreshToken(data.refreshToken);
			return data.accessToken;
		})().finally(() => {
			refreshInFlight = null;
		});
		try {
			return await refreshInFlight;
		} catch {
			return null;
		}
	}
	function logout() {
		store.clearAll();
		onLogout();
	}
	async function authRequestInterceptor(config) {
		const token = await getOrRefreshAccessToken();
		config.headers = config.headers ?? {};
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
			return config;
		}
		delete config.headers.Authorization;
		logout();
		return config;
	}
	let interceptorId = null;
	function attach() {
		if (interceptorId != null) return;
		interceptorId = axiosAuth.interceptors.request.use(authRequestInterceptor);
	}
	function detach() {
		if (interceptorId == null) return;
		axiosAuth.interceptors.request.eject(interceptorId);
		interceptorId = null;
	}
	return {
		attach,
		detach,
		logout,
		setTokens(accessToken, refreshToken) {
			store.setAccessToken(accessToken);
			store.setRefreshToken(refreshToken);
		},
		clearTokens() {
			store.clearAll();
		},
		getAccessToken() {
			return store.getAccessToken();
		},
		getRefreshToken() {
			return store.getRefreshToken();
		}
	};
}
//#endregion
//#region src/jwt-auth/userStore.ts
const useUserStore = create((set, get) => ({
	user: null,
	isReady: false,
	setUser: (user) => set({ user }),
	clearUser: () => set({ user: null }),
	setIsReady: (isReady) => set({ isReady })
}));
//#endregion
//#region src/jwt-auth/RouteProtection.tsx
function RequireAuth({ redirectUrl = "/" }) {
	const { user, isReady } = useUserStore();
	console.log("RequireAuth", {
		isReady,
		user
	});
	if (!isReady) return;
	if (!user) return /* @__PURE__ */ React.createElement(Navigate, {
		to: redirectUrl,
		replace: true
	});
	return /* @__PURE__ */ React.createElement(Outlet, null);
}
function RequireGuest({ redirectUrl = "/dashboard" }) {
	const { user, isReady } = useUserStore();
	console.log("RequireGuest", {
		isReady,
		user
	});
	if (!isReady) return;
	if (user) return /* @__PURE__ */ React.createElement(Navigate, {
		to: redirectUrl,
		replace: true
	});
	return /* @__PURE__ */ React.createElement(Outlet, null);
}
//#endregion
//#region src/react-ui/Button/index.tsx
const Button = ({ text, color = "blue", type = "button", small = false, last = false, disabled = false, onClick }) => {
	return /* @__PURE__ */ React.createElement("button", {
		type,
		className: `
        button-base
        ${small ? "button-small" : ""}
        ${last ? "button-last" : ""}
        button-${color}
      `,
		onClick,
		disabled
	}, text);
};
//#endregion
//#region src/react-ui/cards/Card.tsx
const Card = ({ heading, size = "md", children }) => {
	return /* @__PURE__ */ React.createElement("div", { className: "bka-card" }, heading && /* @__PURE__ */ React.createElement("h2", { className: `bka-card-heading--${size}` }, heading), children);
};
//#endregion
//#region src/react-ui/cards/ItemCard.tsx
const ItemCard = ({ children, onClick }) => {
	return /* @__PURE__ */ React.createElement("div", {
		className: `bka-item-card ${!!onClick ? "bka-item-card-pointer" : ""}`,
		onClick
	}, children);
};
//#endregion
//#region src/react-ui/modals/Modal.tsx
const Modal = ({ isOpen, close, children, closeOnOutsideClick = true }) => {
	if (!isOpen) return null;
	function onClickOutside(e) {
		if (e.target.className.includes("bka-modal-wrapper") && closeOnOutsideClick) close?.();
	}
	const modalWrapper = () => {
		return /* @__PURE__ */ React.createElement("div", {
			className: "bka-modal-fade-in bka-modal-wrapper",
			onClick: onClickOutside
		}, /* @__PURE__ */ React.createElement("div", { className: "bka-modal-fade-in bka-modal-body" }, /* @__PURE__ */ React.createElement("button", {
			className: "bka-modal-x-btn",
			onClick: close
		}, "x"), children));
	};
	return createPortal(modalWrapper(), document.body);
};
//#endregion
//#region src/react-ui/modals/ModalContent.tsx
const ModalContent = ({ heading, children }) => {
	return /* @__PURE__ */ React.createElement("div", { className: "bka-modal-content" }, heading ? /* @__PURE__ */ React.createElement("h2", null, heading) : null, children);
};
//#endregion
//#region src/react-ui/buttons/GhostButton/index.tsx
const GhostButton = ({ onClick, text, type = "button", color = "violet", size = "md", last = false, disabled = false, title }) => {
	return /* @__PURE__ */ React.createElement("button", {
		title,
		type,
		disabled,
		className: `bka-ghost-btn bka-ghost-btn-${color}${size === "sm" ? " bka-ghost-btn-small" : ""}${last ? " bka-ghost-btn-last" : ""}`,
		onClick
	}, text);
};
//#endregion
//#region src/react-ui/modals/ModalButtons.tsx
const ModalButtons = ({ onClose, onConfirm, declineText = "Cancel", confirmText, confirmColor = "green", isDisabled = false }) => {
	const props = {};
	if (typeof onConfirm === "function") props.onClick = onConfirm;
	return /* @__PURE__ */ React.createElement("div", { className: "bka-modal-buttons" }, /* @__PURE__ */ React.createElement(GhostButton, {
		color: "red",
		text: declineText,
		onClick: onClose
	}), /* @__PURE__ */ React.createElement(Button, {
		type: "submit",
		color: confirmColor,
		text: confirmText,
		disabled: isDisabled,
		last: true,
		...props
	}));
};
//#endregion
//#region src/react-ui/modals/DeleteConfirmationModal.tsx
const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, name }) => {
	function handleConfirm() {
		onConfirm();
		onClose();
	}
	return /* @__PURE__ */ React.createElement(Modal, {
		isOpen,
		close: onClose
	}, /* @__PURE__ */ React.createElement("div", { className: "bka-modal---delete-confirmation" }, /* @__PURE__ */ React.createElement("p", null, "Are you sure you want to delete"), /* @__PURE__ */ React.createElement("p", null, name, /* @__PURE__ */ React.createElement("span", null, "\xA0?")), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(GhostButton, {
		color: "grey",
		text: "Cancel",
		onClick: onClose
	}), /* @__PURE__ */ React.createElement(Button, {
		color: "red",
		text: "Delete",
		onClick: handleConfirm,
		last: true
	}))));
};
//#endregion
//#region src/react-ui/buttons/ActionButton/index.tsx
const ActionButton = ({ iconClass, color = "green", type = "button", size = "md", text, onClick, title }) => {
	const style = { fontSize: "12px" };
	if (size !== "md") {
		if (size === "sm") style.fontSize = "9px";
		if (size === "lg") style.fontSize = "15px";
		if (size === "xl") style.fontSize = "18px";
	}
	return /* @__PURE__ */ React.createElement("button", {
		type,
		style,
		title,
		className: `bka-action-btn bka-action-btn--${color}`,
		onClick
	}, iconClass ? /* @__PURE__ */ React.createElement("i", { className: iconClass }) : text);
};
//#endregion
//#region src/react-ui/buttons/TextButton/index.tsx
const TextButton = ({ onClick, type = "button", text, color = "blue", size = "md", title }) => {
	const style = { fontSize: "12px" };
	if (size !== "md") {
		if (size === "sm") style.fontSize = "8px";
		if (size === "lg") style.fontSize = "16px";
		if (size === "xl") style.fontSize = "20px";
	}
	return /* @__PURE__ */ React.createElement("button", {
		type,
		style,
		title,
		className: `bka-text-btn bka-text-btn-${color}`,
		onClick
	}, text);
};
//#endregion
//#region src/react-ui/buttons/TransparentButton/index.tsx
const TransparentButton = ({ onClick, text, type, color = "blue", size = "md", title }) => {
	const style = { fontSize: "16px" };
	if (size !== "md") {
		if (size === "sm") style.fontSize = "12px";
		if (size === "lg") style.fontSize = "20px";
		if (size === "xl") style.fontSize = "24px";
	}
	return /* @__PURE__ */ React.createElement("button", {
		type,
		style,
		title,
		className: `bka-transparent-btn bka-transparent-btn-${color}`,
		onClick
	}, text);
};
//#endregion
//#region src/react-ui/formElements/input/index.tsx
const Input = ({ type = "text", name, value, onChange, full = false, autofocus = false, required = false, step, placeholder, min, max }) => {
	const inputRef = React.useRef(null);
	useEffect(() => {
		if (autofocus) requestAnimationFrame(() => inputRef.current?.focus());
	}, [autofocus]);
	const props = {};
	if (step) props.step = step;
	if (placeholder) props.placeholder = placeholder;
	if (min) props.min = min;
	if (max) props.max = max;
	return /* @__PURE__ */ React.createElement("input", {
		className: `bka-form-element ${full ? "bka-form-element-full" : ""}`,
		type,
		name,
		value,
		onChange,
		ref: inputRef,
		required,
		...props
	});
};
//#endregion
//#region src/react-ui/formElements/listInput/index.tsx
const ListInput = ({ items, onChange, placeholder, full = false }) => {
	const inputRef = useRef(null);
	const handleKeyDown = (e) => {
		if (e.key === "Enter") {
			e.preventDefault();
			const value = e.currentTarget.value.trim();
			if (!value) return;
			onChange([...items, value]);
			e.currentTarget.value = "";
		}
	};
	const remove = (index) => {
		onChange(items.filter((_, i) => i !== index));
	};
	return /* @__PURE__ */ React.createElement("div", { className: "bka-list-input" }, items.map((item, i) => /* @__PURE__ */ React.createElement("div", { key: i }, /* @__PURE__ */ React.createElement("span", null, item), /* @__PURE__ */ React.createElement("button", {
		type: "button",
		onClick: () => remove(i)
	}, "✕"))), /* @__PURE__ */ React.createElement("input", {
		ref: inputRef,
		onKeyDown: handleKeyDown,
		placeholder: placeholder ?? "Type and press Enter to add",
		className: `bka-form-element ${full ? "bka-form-element-full" : ""}`
	}));
};
//#endregion
//#region src/react-ui/formElements/label/index.tsx
const Label = ({ text, inline }) => {
	return /* @__PURE__ */ React.createElement("label", { className: `bka-label ${inline ? "bka-label-inline" : ""}` }, text);
};
//#endregion
//#region src/react-ui/formElements/select/index.tsx
const Select = ({ name, value, onChange, full = false, children }) => {
	return /* @__PURE__ */ React.createElement("select", {
		className: `bka-form-element bka-select ${full ? "bka-form-element-full" : ""}`,
		name,
		value,
		onChange,
		autoFocus: true
	}, children);
};
//#endregion
//#region src/react-ui/formElements/textarea/index.tsx
const Textarea = ({ name, value, onChange, full = false, rows = 2, autofocus = false, placeholder }) => {
	const addedProps = {};
	if (autofocus) addedProps.autoFocus = autofocus;
	if (rows !== 0) addedProps.rows = rows;
	if (placeholder) addedProps.placeholder = placeholder;
	return /* @__PURE__ */ React.createElement("textarea", {
		className: `bka-form-element bka-textarea ${full ? "bka-form-element-full" : ""}`,
		name,
		value,
		onChange,
		...addedProps
	});
};
//#endregion
//#region src/react-ui/formElements/inputGroup/index.tsx
const InputGroup = ({ label, children }) => {
	return /* @__PURE__ */ React.createElement("div", { className: "bka-input-group" }, /* @__PURE__ */ React.createElement(Label, { text: label }), children);
};
//#endregion
//#region src/webpackConfigDefaults/index.ts
const defaultShared = {
	react: { singleton: true },
	"react-dom": { singleton: true },
	"react-router-dom": { singleton: true },
	"@tanstack/react-query": { singleton: true },
	zustand: { singleton: true },
	"@bka-stuff/pe-mfe-utils": { singleton: true }
};
function createWebpackConfig(options) {
	const { appName, port = 3e3, resolve, _dirname, publicPath = "auto" } = options;
	return {
		mode: "development",
		entry: "./src/index.ts",
		output: {
			publicPath,
			uniqueName: appName,
			chunkLoadingGlobal: `webpackChunk_${appName}`,
			crossOriginLoading: "anonymous",
			path: resolve(_dirname, "dist"),
			filename: "[name].bundle.js",
			clean: true
		},
		resolve: {
			extensions: [
				".ts",
				".tsx",
				".js",
				".jsx"
			],
			symlinks: true,
			alias: {
				axios: resolve(_dirname, "node_modules/axios"),
				react: resolve(_dirname, "node_modules/react"),
				"react-dom": resolve(_dirname, "node_modules/react-dom")
			}
		},
		module: { rules: [{
			test: /\.tsx?$/,
			use: {
				loader: "ts-loader",
				options: {
					configFile: resolve(_dirname, "tsconfig.json"),
					transpileOnly: true
				}
			},
			exclude: /node_modules/
		}, {
			test: /\.css$/,
			use: [
				"style-loader",
				"css-loader",
				"postcss-loader"
			]
		}] },
		devServer: {
			port,
			hot: false,
			historyApiFallback: true,
			client: { overlay: {
				warnings: false,
				errors: true,
				runtimeErrors: (error) => !error.message.includes("ResizeObserver loop")
			} },
			headers: {
				"Access-Control-Allow-Origin": "*",
				"Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
				"Access-Control-Allow-Headers": "*"
			}
		}
	};
}
//#endregion
//#region src/tracer-store/index.ts
const useTracerStore = create((set) => ({
	traces: [],
	addTraceId: (trace) => set((state) => ({ traces: [...state.traces, trace] })),
	removeTraceId: (trace) => set((state) => ({ traces: state.traces.filter((t) => t.id !== trace.id) }))
}));
function startTrace(label) {
	const traceId = crypto.randomUUID();
	useTracerStore.getState().addTraceId({
		id: traceId,
		label
	});
	return traceId;
}
//#endregion
export { ActionButton, Button, Card, DeleteConfirmationModal, GhostButton, Input, InputGroup, ItemCard, Label, ListInput, Modal, ModalButtons, ModalContent, RequireAuth, RequireGuest, Select, TextButton, Textarea, TransparentButton, createAuthClient, createTokenStore, createWebpackConfig, defaultShared, exchangeRefreshToken, isTokenExpired, startTrace, useTracerStore, useUserStore };
