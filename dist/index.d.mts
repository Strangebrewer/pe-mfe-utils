import * as _$zustand from "zustand";
import React, { FC } from "react";
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
  variant: 'blue' | 'green' | 'red' | 'grey' | 'lime' | 'purple';
  color?: string;
  small?: boolean;
  last?: boolean;
  disabled?: boolean;
  onClick?: () => void;
};
declare const Button: FC<ButtonProps>;
//#endregion
//#region src/react-ui/Modal/index.d.ts
type ModalProps = {
  isOpen: boolean;
  children: React.ReactNode;
  closeOnOutsideClick?: boolean;
  close?: () => void;
};
declare const Modal: FC<ModalProps>;
//#endregion
//#region src/react-ui/buttons/ActionButton/index.d.ts
type ActionButtonProps = {
  iconClass?: string;
  text?: string;
  onClick: () => any;
  color?: 'blue' | 'red' | 'green';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  title?: string;
};
declare const ActionButton: FC<ActionButtonProps>;
//#endregion
//#region src/react-ui/buttons/TextButton/index.d.ts
type TextButtonProps = {
  onClick: () => any;
  text: string;
  color?: 'blue' | 'red' | 'indigo' | 'green';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  title?: string;
};
declare const TextButton: FC<TextButtonProps>;
//#endregion
//#region src/react-ui/buttons/TransparentButton/index.d.ts
type TransparentButtonProps = {
  onClick: () => any;
  text: string;
  color?: 'blue' | 'red' | 'indigo' | 'green';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  title?: string;
};
declare const TransparentButton: FC<TransparentButtonProps>;
//#endregion
//#region src/react-ui/formElements/input/index.d.ts
type InputProps = {
  type: string;
  name: string;
  value: any;
  onChange: (e: any) => any;
  full?: boolean | "true";
  autofocus?: boolean;
};
declare const Input: FC<InputProps>;
//#endregion
//#region src/react-ui/formElements/label/index.d.ts
type LabelProps = {
  text: string;
};
declare const Label: FC<LabelProps>;
//#endregion
//#region src/react-ui/formElements/select/index.d.ts
type SelectProps = {
  name: string;
  value: any;
  onChange: (e: any) => any;
  full?: boolean | "true";
  children: React.ReactNode;
};
declare const Select: FC<SelectProps>;
//#endregion
//#region src/react-ui/formElements/textarea/index.d.ts
type TextareaProps = {
  name: string;
  value: any;
  onChange: (e: any) => any;
  full?: boolean | "true";
  autofocus?: boolean;
};
declare const Textarea: FC<TextareaProps>;
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
  'react-dom': {
    singleton: boolean;
  };
  'react-router-dom': {
    singleton: boolean;
  };
  '@tanstack/react-query': {
    singleton: boolean;
  };
  zustand: {
    singleton: boolean;
  };
  '@bka-stuff/pe-mfe-utils': {
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
      'react-dom': string;
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
      'Access-Control-Allow-Origin': string;
      'Access-Control-Allow-Methods': string;
      'Access-Control-Allow-Headers': string;
    };
  };
};
//#endregion
export { ActionButton, Button, Input, Label, Modal, RequireAuth, RequireGuest, Select, TextButton, Textarea, TokenExchangeResponse, TokenKeys, TransparentButton, UserStore, createAuthClient, createTokenStore, createWebpackConfig, defaultShared, exchangeRefreshToken, isTokenExpired, useUserStore };