const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const JavaScriptObfuscator = require('javascript-obfuscator');

module.exports = (env, argv) => {
    const isProduction = argv.mode === 'production';

    return {
        entry: './src/js/main.js',
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: 'bundle.[contenthash].js',
            publicPath: isProduction ? '/poc-obfuscator-v1/' : '/',
            clean: true,
        },
        devtool: isProduction ? false : 'eval-source-map',
        module: {
            rules: [
                {
                    test: /\.css$/,
                    use: ['style-loader', 'css-loader'],
                },
            ],
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: './src/index.html',
            }),
            isProduction && {
                apply: (compiler) => {
                    compiler.hooks.emit.tapAsync('Obfuscator', (compilation, callback) => {
                        compilation.assets = Object.entries(compilation.assets).reduce((acc, [filename, asset]) => {
                            if (filename.endsWith('.js')) {
                                const source = asset.source();
                                const obfuscated = JavaScriptObfuscator.obfuscate(source, {
                                    compact: true,
                                    controlFlowFlattening: true,
                                    deadCodeInjection: true,
                                    debugProtection: true,
                                    debugProtectionInterval: 4000,
                                    disableConsoleOutput: true,
                                    identifierNamesGenerator: 'hexadecimal',
                                    log: false,
                                    numbersToExpressions: true,
                                    renameGlobals: false,
                                    selfDefending: true,
                                    simplify: true,
                                    splitStrings: true,
                                    stringArray: true,
                                    stringArrayEncoding: ['base64'],
                                    stringArrayThreshold: 0.75,
                                    unicodeEscapeSequence: false,
                                    sourceMap: true,
                                    sourceMapBaseUrl: '',
                                    sourceMapFileName: `${filename}.map`,
                                }).getObfuscatedCode();
                                
                                acc[`${filename}.map`] = {
                                  source: () => obfuscated.sourceMap,
                                  size: () => obfuscated.sourceMap.length,
                                };

                                acc[filename] = {
                                    source: () => obfuscated,
                                    size: () => obfuscated.length,
                                };
                            } else {
                                acc[filename] = asset;
                            }
                            return acc;
                        }, {});
                        callback();
                    });
                },
            },
        ].filter(Boolean),
        devServer: {
            static: {
                directory: path.join(__dirname, 'dist'),
            },
            compress: true,
            port: 9000,
            open: true,
        },
    };
}; 