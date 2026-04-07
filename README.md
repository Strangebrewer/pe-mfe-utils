# pe-mfe-utils

Auth utilities, a basic React component library, and shared webpack config for micro-frontend repos. I created this so I could share logic between MFEs without copying it into each one.

## Auth Utils
To use the auth utils in a project:

`pnpm add @bka-stuff/mfe-utils@git+https://github.com/Strangebrewer/mfe-utils.git#main`

Then create an `axios.ts` file:

```
import axios from "axios";
import { createAuthClient } from "@bka-stuff/mfe-utils";

const BASE_URL = "http://localhost:8080";

export const axiosPublic = axios.create({ baseURL: BASE_URL });
export const axiosAuth = axios.create({ baseURL: BASE_URL });

createAuthClient({
  axiosPublic,
  axiosAuth,
  onLogout: () => {
    // whatever the shell should do
    console.log("Logged out");
  },
}).attach();
```

Then use `axiosPublic` and `axiosAuth` wherever you feel like. All the token refresh and all that stuff is handled by the package.

### Defaults
There are a few defaults that can be changed by adding props to `createAuthClient` options:
- `storage`: defaults to localstorage
- `keys`: defaults to `{ access: "access_token", refresh: "refresh_token" }
  - you can change one or both of these
- `refreshEndpoint`: defaults to `/token/exchange`

## Webpack config

`createWebpackConfig` provides base webpack defaults for MFE repos. Each MFE spreads it and adds its own plugins:

```ts
import path from 'path';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { createWebpackConfig, defaultShared } from '@bka-stuff/mfe-utils';

export default {
  ...createWebpackConfig({ appName: 'my-app', port: 3001, resolve: path.resolve, _dirname: __dirname }),
  plugins: [
    new HtmlWebpackPlugin({ template: './public/index.html' }),
    new webpack.container.ModuleFederationPlugin({
      name: 'my-app',
      filename: 'remoteEntry.js',
      exposes: { './App': './src/App' },
      shared: { ...defaultShared },
    }),
  ],
};
```