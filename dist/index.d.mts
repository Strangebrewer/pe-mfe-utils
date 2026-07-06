import * as _$zustand from "zustand";
import React, { FC, ReactNode } from "react";
import { AxiosInstance } from "axios";

//#region src/jwt-auth/tokenStore.d.ts
type TokenKeys = {
  access: string;
  refresh: string;
};
declare function createTokenStore(storage?: Storage, keys?: Partial<TokenKeys>): {
  setAccessToken(token: string): void;
  getAccessToken(): string | null;
  clearAccessToken(): void;
  setRefreshToken(token: string): void;
  getRefreshToken(): string | null;
  clearRefreshToken(): void;
  clearAll(): void;
  keys: TokenKeys;
};
//#endregion
//#region src/jwt-auth/jwt.d.ts
declare function isTokenExpired(token: string): boolean;
//#endregion
//#region src/jwt-auth/refresh.d.ts
type TokenExchangeResponse = {
  accessToken: string;
  refreshToken: string;
};
declare function exchangeRefreshToken(axios: AxiosInstance, refreshToken: string, endpoint?: string): Promise<TokenExchangeResponse>;
//#endregion
//#region src/jwt-auth/client.d.ts
type CreateAuthClientOptions = {
  /** Used ONLY for refresh calls (must NOT have auth interceptor attached) */axiosPublic: AxiosInstance; /** Used for normal API calls that should carry Authorization */
  axiosAuth: AxiosInstance;
  onLogout: () => void;
  storage?: Storage;
  keys?: Partial<TokenKeys>;
  refreshEndpoint?: string;
};
declare function createAuthClient(options: CreateAuthClientOptions): {
  attach: () => void;
  detach: () => void;
  logout: () => void;
  setTokens(accessToken: string, refreshToken: string): void;
  clearTokens(): void;
  getAccessToken(): string | null;
  getRefreshToken(): string | null;
};
//#endregion
//#region src/jwt-auth/userStore.d.ts
type User = {
  id: string;
  email: string;
  isDemo?: boolean;
};
interface UserStore {
  user: User | null;
  isReady: boolean;
  setUser: (user: User) => void;
  clearUser: () => void;
  setIsReady: (ready: boolean) => void;
}
declare const useUserStore: _$zustand.UseBoundStore<_$zustand.StoreApi<UserStore>>;
//#endregion
//#region src/jwt-auth/RouteProtection.d.ts
declare function RequireAuth({
  redirectUrl
}: {
  redirectUrl?: string | undefined;
}): React.JSX.Element | undefined;
declare function RequireGuest({
  redirectUrl
}: {
  redirectUrl?: string | undefined;
}): React.JSX.Element | undefined;
//#endregion
//#region src/react-ui/Button/index.d.ts
type ButtonProps = {
  text: string;
  color: "blue" | "green" | "red" | "grey" | "purple" | "yellow";
  type?: "button" | "submit" | "reset";
  small?: boolean;
  last?: boolean;
  disabled?: boolean;
  onClick?: (event?: any) => void;
};
declare const Button: FC<ButtonProps>;
//#endregion
//#region src/react-ui/cards/Card.d.ts
type Props$6 = {
  children: React.ReactNode;
  heading?: string;
  size?: "sm" | "md" | "lg";
};
declare const Card: FC<Props$6>;
//#endregion
//#region src/react-ui/cards/ItemCard.d.ts
type Props$5 = {
  children: React.ReactNode;
  onClick?: (e?: any) => void;
};
declare const ItemCard: FC<Props$5>;
//#endregion
//#region src/react-ui/modals/Modal.d.ts
type ModalProps = {
  isOpen: boolean;
  children: React.ReactNode;
  closeOnOutsideClick?: boolean;
  close?: () => void;
};
declare const Modal: FC<ModalProps>;
//#endregion
//#region src/react-ui/modals/ModalContent.d.ts
type Props$4 = {
  heading?: string;
  children: ReactNode;
};
declare const ModalContent: FC<Props$4>;
//#endregion
//#region src/react-ui/modals/ModalButtons.d.ts
type Props$3 = {
  onClose: () => void;
  onConfirm?: () => void;
  confirmText: string;
  confirmColor?: string;
  declineText?: string;
  isDisabled?: boolean;
};
declare const ModalButtons: FC<Props$3>;
//#endregion
//#region src/react-ui/modals/DeleteConfirmationModal.d.ts
type Props$2 = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  name?: string;
};
declare const DeleteConfirmationModal: FC<Props$2>;
//#endregion
//#region src/react-ui/buttons/ActionButton/index.d.ts
type ActionButtonProps = {
  iconClass?: string;
  text?: string;
  type?: "button" | "submit" | "reset";
  onClick: () => any;
  color?: "blue" | "red" | "green" | "purple";
  size?: "sm" | "md" | "lg" | "xl";
  title?: string;
};
declare const ActionButton: FC<ActionButtonProps>;
//#endregion
//#region src/react-ui/buttons/GhostButton/index.d.ts
type GhostButtonProps = {
  onClick: (event?: any) => any;
  text: string;
  type?: "button" | "submit" | "reset";
  color?: "purple" | "blue" | "green" | "red" | "grey";
  size?: "sm" | "md";
  last?: boolean;
  disabled?: boolean;
  title?: string;
};
declare const GhostButton: FC<GhostButtonProps>;
//#endregion
//#region src/react-ui/buttons/TextButton/index.d.ts
type TextButtonProps = {
  onClick: () => any;
  text: string;
  type?: "button" | "submit" | "reset";
  color?: "blue" | "red" | "purple" | "green";
  size?: "sm" | "md" | "lg" | "xl";
  title?: string;
};
declare const TextButton: FC<TextButtonProps>;
//#endregion
//#region src/react-ui/buttons/TransparentButton/index.d.ts
type TransparentButtonProps = {
  onClick: () => any;
  text: string;
  type?: "button" | "submit" | "reset";
  color?: "blue" | "red" | "purple" | "green";
  size?: "sm" | "md" | "lg" | "xl";
  title?: string;
};
declare const TransparentButton: FC<TransparentButtonProps>;
//#endregion
//#region src/react-ui/formElements/input/index.d.ts
type InputProps = {
  type?: string;
  name?: string;
  value: any;
  onChange: (e: any) => any;
  full?: boolean | "true";
  autofocus?: boolean;
  required?: boolean;
  step?: string;
  placeholder?: string;
  min?: string;
  max?: string;
};
declare const Input: FC<InputProps>;
//#endregion
//#region src/react-ui/formElements/listInput/index.d.ts
type Props$1 = {
  items: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
  full?: boolean;
};
declare const ListInput: FC<Props$1>;
//#endregion
//#region src/react-ui/formElements/label/index.d.ts
type LabelProps = {
  text: string;
  inline?: boolean;
};
declare const Label: FC<LabelProps>;
//#endregion
//#region src/react-ui/formElements/select/index.d.ts
type SelectProps = {
  name?: string;
  value: any;
  onChange: (e: any) => any;
  full?: boolean | "true";
  children: React.ReactNode;
};
declare const Select: FC<SelectProps>;
//#endregion
//#region src/react-ui/formElements/textarea/index.d.ts
type TextareaProps = {
  name?: string;
  value: any;
  onChange: (e: any) => any;
  full?: boolean | "true";
  rows?: number;
  autofocus?: boolean;
  placeholder?: string;
};
declare const Textarea: FC<TextareaProps>;
//#endregion
//#region src/react-ui/formElements/inputGroup/index.d.ts
type Props = {
  label: string;
  children: ReactNode;
};
declare const InputGroup: FC<Props>;
//#endregion
//#region src/webpackConfigDefaults/index.d.ts
interface WebpackConfigOptions {
  appName: string;
  exposes?: Record<string, string>;
  shared?: Record<string, object>;
  port?: number;
  resolve: (...paths: string[]) => string;
  _dirname: string;
  publicPath?: string;
}
declare const defaultShared: {
  react: {
    singleton: boolean;
  };
  "react-dom": {
    singleton: boolean;
  };
  "react-router-dom": {
    singleton: boolean;
  };
  "@tanstack/react-query": {
    singleton: boolean;
  };
  zustand: {
    singleton: boolean;
  };
  "@bka-stuff/pe-mfe-utils": {
    singleton: boolean;
  };
};
declare function createWebpackConfig(options: WebpackConfigOptions): {
  mode: string;
  entry: string;
  output: {
    publicPath: string;
    uniqueName: string;
    chunkLoadingGlobal: string;
    crossOriginLoading: string;
    path: string;
    filename: string;
    clean: boolean;
  };
  resolve: {
    extensions: string[];
    symlinks: boolean;
    alias: {
      axios: string;
      react: string;
      "react-dom": string;
    };
  };
  module: {
    rules: ({
      test: RegExp;
      use: {
        loader: string;
        options: {
          configFile: string;
          transpileOnly: boolean;
        };
      };
      exclude: RegExp;
    } | {
      test: RegExp;
      use: string[];
      exclude?: undefined;
    })[];
  };
  devServer: {
    port: number;
    hot: boolean;
    historyApiFallback: boolean;
    client: {
      overlay: {
        warnings: boolean;
        errors: boolean;
        runtimeErrors: (error: any) => boolean;
      };
    };
    headers: {
      "Access-Control-Allow-Origin": string;
      "Access-Control-Allow-Methods": string;
      "Access-Control-Allow-Headers": string;
    };
  };
};
//#endregion
//#region src/tracer-store/index.d.ts
type Trace = {
  id: string;
  label: string;
};
interface TracerStore {
  traces: Trace[];
  addTraceId: (trace: Trace) => void;
  removeTraceId: (trace: Trace) => void;
}
declare const useTracerStore: _$zustand.UseBoundStore<_$zustand.StoreApi<TracerStore>>;
declare function startTrace(label: string): `${string}-${string}-${string}-${string}-${string}`;
//#endregion
export { ActionButton, Button, Card, DeleteConfirmationModal, GhostButton, Input, InputGroup, ItemCard, Label, ListInput, Modal, ModalButtons, ModalContent, RequireAuth, RequireGuest, Select, TextButton, Textarea, TokenExchangeResponse, TokenKeys, TracerStore, TransparentButton, UserStore, createAuthClient, createTokenStore, createWebpackConfig, defaultShared, exchangeRefreshToken, isTokenExpired, startTrace, useTracerStore, useUserStore };