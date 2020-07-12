const webpack = require('webpack');

const path = require('path');
const getAliases = require('./aliases');

module.exports = (env, argv, opt = {}) => {
  const relativePath = path.relative(process.cwd(), opt.dirname);

  const pathToLib = opt.package.main.split('/');
  const entry = './' + path.join(relativePath, './src/index.ts');

  const filename = pathToLib.pop();
  const outDir = path.resolve(opt.dirname, pathToLib.join('/'));

  const library = opt.library;
  const libraryExport =
    opt.libraryExport !== undefined
      ? opt.libraryExport === ''
        ? '' // undefined for webpack5
        : opt.libraryExport
      : 'default';

  const useExternals = opt.externals !== undefined ? opt.externals : false;

  const isProd = argv.mode === 'production';

  const getExternals = [
    function (context, request, callback) {
      // Absolute & Relative paths are not externals
      if (request.match(/^(\.{0,2})\//)) {
        return callback();
      }
      try {
        // Attempt to resolve the module via Node
        require.resolve(request);
        // callback(null, request, 'commonjs2');
        callback(null, request);
      } catch (e) {
        // Node couldn't find it, so it must be user-aliased
        callback();
      }
    },
  ];
  const configFile = path.join(__dirname, '../../eslint-config/index.js');

  const getRules = ({ module, declaration } = {}) => {
    const compilerOptions = {
      paths: {},
    };
    if (module) {
      Object.assign(compilerOptions, {
        // target: 'es5', // 'ESNext'
        // module: 'ES2015', // 'ES2015'
        // esModuleInterop: true,
        // forceConsistentCasingInFileNames: true,
      });
    }
    if (declaration) {
      Object.assign(compilerOptions, {
        declaration: true,
        declarationMap: true,
        declarationDir: 'lib',
      });
    }
    const rules = [
      {
        enforce: 'pre',
        test: /\.tsx?$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
        options: {
          fix: true,
          configFile,
        },
      },
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              compilerOptions,
            },
          },
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(jpe?g|png|ttf|eot|svg|woff(2)?)(\?[a-z0-9=&.]+)?$/,
        use: 'base64-inline-loader?limit=1000&name=[name].[ext]',
      },
    ];
    return rules;
  };

  const plugins = [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(argv.mode || 'development'),
    }),
  ];

  // const alias = getAliases();

  let alias = {};
  if (isProd) {
    // const { BundleAnalyzerPlugin }= require('webpack-bundle-analyzer');
    // plugins = plugins.concat([
    //   // new BundleAnalyzerPlugin()
    // ]);
  } else {
    alias = getAliases();
  }

  const getCommonConfig = () => {
    return {
      mode: argv.mode || 'development',
      devtool: isProd ? 'source-map' : 'inline-source-map',
      entry,
      resolve: {
        extensions: ['.ts', '.js', '.json'],
        alias,
      },
      module: {
        rules: getRules(),
      },
      externals: useExternals ? {} : getExternals,
      plugins,
    };
  };

  const configs = [];
  const umdOutput = {
    library,
    libraryExport,
    libraryTarget: 'umd',
    globalObject: "typeof self !== 'undefined' ? self : this", // https://github.com/webpack/webpack/issues/6522
  };

  const umdConfig = {
    ...getCommonConfig(),
    module: {
      rules: getRules({ declaration: true }),
    },
    output: {
      // ecmaVersion: 5,
      path: outDir,
      filename,
      ...umdOutput,
    },
  };
  configs.push(umdConfig);

  // if (useExternals) {
  //   const allInOneConfig = {
  //     ...umdConfig,
  //     output: {
  //       ...umdConfig.output,
  //       filename: filename.replace('.js', '.browser.js'),
  //     },
  //     externals: {},
  //   };
  //   configs.push(allInOneConfig);
  // }
  if (isProd && !useExternals) {
    const moduleConfig = {
      ...getCommonConfig(),
      module: {
        rules: getRules({ module: true, declaration: true }),
      },
      // experiments: {
      //   outputModule: true,
      // },
      output: {
        // module: true,
        path: outDir,
        filename: filename.replace('.js', '.esm.js'),

        ...umdOutput,
      },
      externals: getExternals,
      // optimization: {
      //   usedExports: false,
      //   concatenateModules: false,
      // },
    };
    // configs.push(moduleConfig);
  }

  return configs;
};
