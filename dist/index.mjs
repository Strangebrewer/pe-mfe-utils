import { jwtDecode } from "jwt-decode";
import { create } from "zustand";
import React, { useEffect } from "react";
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
const Button = ({ text, variant, color, small = false, last = false, disabled = false, onClick }) => {
	const style = {};
	if (color) style.color = color;
	return /* @__PURE__ */ React.createElement("button", {
		className: `
        button-base
        ${small ? "button-small" : ""}
        ${last ? "button-last" : ""}
        button-${variant}
      `,
		...style,
		onClick,
		disabled
	}, text);
};
//#endregion
//#region src/react-ui/Modal/index.tsx
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
//#region src/react-ui/buttons/ActionButton/index.tsx
const ActionButton = ({ iconClass, color = "green", size = "md", text, onClick, title }) => {
	const style = { fontSize: "12px" };
	if (size !== "md") {
		if (size === "sm") style.fontSize = "9px";
		if (size === "lg") style.fontSize = "15px";
		if (size === "xl") style.fontSize = "18px";
	}
	return /* @__PURE__ */ React.createElement("button", {
		style,
		title,
		className: `bka-action-btn bka-action-btn--${color}`,
		onClick
	}, iconClass ? /* @__PURE__ */ React.createElement("i", { className: iconClass }) : text);
};
//#endregion
//#region src/react-ui/buttons/TextButton/index.tsx
const TextButton = ({ onClick, text, color = "blue", size = "md", title }) => {
	const style = { fontSize: "12px" };
	if (size !== "md") {
		if (size === "sm") style.fontSize = "8px";
		if (size === "lg") style.fontSize = "16px";
		if (size === "xl") style.fontSize = "20px";
	}
	return /* @__PURE__ */ React.createElement("button", {
		style,
		title,
		className: `bka-text-btn bka-text-btn-${color}`,
		onClick
	}, text);
};
//#endregion
//#region src/react-ui/buttons/TransparentButton/index.tsx
const TransparentButton = ({ onClick, text, color = "blue", size = "md", title }) => {
	const style = { fontSize: "16px" };
	if (size !== "md") {
		if (size === "sm") style.fontSize = "12px";
		if (size === "lg") style.fontSize = "20px";
		if (size === "xl") style.fontSize = "24px";
	}
	return /* @__PURE__ */ React.createElement("button", {
		style,
		title,
		className: `bka-transparent-btn bka-transparent-btn-${color}`,
		onClick
	}, text);
};
//#endregion
//#region src/react-ui/formElements/input/index.tsx
const Input = ({ type = "text", name, value, onChange, full = false, autofocus = false }) => {
	const inputRef = React.useRef(null);
	useEffect(() => {
		if (autofocus) requestAnimationFrame(() => inputRef.current?.focus());
	}, [autofocus]);
	return /* @__PURE__ */ React.createElement("input", {
		className: `bka-form-element ${full ? "bka-form-element-full" : ""}`,
		type,
		name,
		value,
		onChange,
		ref: inputRef
	});
};
//#endregion
//#region src/react-ui/formElements/label/index.tsx
const Label = ({ text }) => {
	return /* @__PURE__ */ React.createElement("label", { className: "bka-label" }, text);
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
const Textarea = ({ name, value, onChange, full = false, autofocus = false }) => {
	const addedProps = {};
	if (autofocus) addedProps.autoFocus = autofocus;
	return /* @__PURE__ */ React.createElement("textarea", {
		className: `bka-form-element bka-textarea ${full ? "bka-form-element-full" : ""}`,
		name,
		value,
		onChange,
		...addedProps
	});
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
export { ActionButton, Button, Input, Label, Modal, RequireAuth, RequireGuest, Select, TextButton, Textarea, TransparentButton, createAuthClient, createTokenStore, createWebpackConfig, defaultShared, exchangeRefreshToken, isTokenExpired, useUserStore };
