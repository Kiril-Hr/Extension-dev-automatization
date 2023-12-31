const path = require('path')
const TerserPlugin = require('terser-webpack-plugin')
const JavaScriptObfuscator = require('webpack-obfuscator')
const Dotenv = require('dotenv-webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const updaterExtensionAdditional = require('./src/core/webpackCompileUtiils/additionalUpdater')
const executeModulesSeparately = require('./src/core/webpackCompileUtiils/executionModulesSeparately')

///////////////////////////////////////////////////////////////// - development or production
const mode = 'development'
/////////////////////////////////////////////////////////////////

//executeModulesSeparately()

const optimizationObfuscator = {
  compact: true,
    controlFlowFlatteningThreshold: 0.75,
    controlFlowFlattening: true,
    numbersToExpressions: true,
    simplify: true,
    splitStrings: true,
    stringArrayThreshold: 0.75,
    unicodeEscapeSequence: true,
}

const JavaScriptObfuscatorParams = {
  compact: true,
  controlFlowFlattening: true,
  deadCodeInjection: true,
  stringArray: true,
  rotateStringArray: true,
  selfDefending: true,
  optimization: optimizationObfuscator
}

const TerserPluginParams = {
  terserOptions: {
    format: {
      comments: false,
    },
  },
  extractComments: false,
}

const copyWebpackPlugin = {
  patterns: [
    {
      from: path.resolve(__dirname, 'src/extensionOptions/assets'),
      to: path.resolve(__dirname, 'dist/assets')
    }
  ]
}

const manifestBackgroundUpdater = () => {
   return updaterExtensionAdditional()
}

const isProduction = mode !== 'development'

const Plugins = isProduction ? [
  new JavaScriptObfuscator(JavaScriptObfuscatorParams),
  new CopyWebpackPlugin(copyWebpackPlugin),
  new Dotenv(),
  manifestBackgroundUpdater
] : [
  new CopyWebpackPlugin(copyWebpackPlugin),
  new Dotenv(),
  manifestBackgroundUpdater
]

console.log("CURRENT MODE ------------------------------------------>", mode)

module.exports = {
    mode: mode,
    performance: { hints: false, maxEntrypointSize: 512000, maxAssetSize: 512000 },
    devtool: (mode === 'development') ? 'inline-source-map' : false,
    entry: './src/runner.ts',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'runner.js',
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'babel-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
    optimization: {
        minimize: isProduction,
        minimizer: isProduction ?
          [ new TerserPlugin(TerserPluginParams) ] : [],
    },
    plugins: Plugins,
}
