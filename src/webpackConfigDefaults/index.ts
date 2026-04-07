interface WebpackConfigOptions {
  appName: string;
  exposes?: Record<string, string>;
  shared?: Record<string, object>;
  port?: number;
  resolve: (...paths: string[]) => string;
  _dirname: string;
  publicPath?: string;
}

export const defaultShared = {
  react: { singleton: true },
  'react-dom': { singleton: true },
  'react-router-dom': { singleton: true },
  '@tanstack/react-query': { singleton: true },
  zustand: { singleton: true },
  '@bka-stuff/pe-mfe-utils': { singleton: true },
};

export function createWebpackConfig(options: WebpackConfigOptions) {
  const {
    appName,
    port = 3000,
    resolve,
    _dirname,
    publicPath = 'auto',
  } = options;

  return {
    mode: 'development',
    entry: './src/index.ts',

    output: {
      publicPath,
      uniqueName: appName,
      chunkLoadingGlobal: `webpackChunk_${appName}`,
      crossOriginLoading: 'anonymous',
      path: resolve(_dirname, 'dist'),
      filename: '[name].bundle.js',
      clean: true,
    },

    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx'],
      symlinks: true,
      alias: {
        axios: resolve(_dirname, 'node_modules/axios'),
        react: resolve(_dirname, 'node_modules/react'),
        'react-dom': resolve(_dirname, 'node_modules/react-dom'),
      },
    },

    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: {
            loader: 'ts-loader',
            options: {
              configFile: resolve(_dirname, 'tsconfig.json'),
              transpileOnly: true,
            },
          },
          exclude: /node_modules/,
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader', 'postcss-loader'],
        },
      ],
    },

    devServer: {
      port,
      hot: false,
      historyApiFallback: true,
      client: {
        overlay: {
          warnings: false,
          errors: true,
          runtimeErrors: (error: any) => !error.message.includes('ResizeObserver loop'),
        },
      },
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
        'Access-Control-Allow-Headers': '*',
      },
    },
  };
}
