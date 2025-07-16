const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
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
        devtool: false, // Desativado para produção
        module: {
            rules: [
                {
                    test: /\.css$/,
                    use: [
                        isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
                        'css-loader'
                    ],
                },
            ],
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: './src/index.html',
            }),
            isProduction && new MiniCssExtractPlugin({
                filename: 'styles.[contenthash].css',
            }),
            /*
            isProduction && {
                apply: (compiler) => {
                    compiler.hooks.emit.tapAsync('Obfuscator', (compilation, callback) => {
                        const newAssets = {};
                        for (const filename in compilation.assets) {
                            if (filename.endsWith('.js')) {
                                const asset = compilation.assets[filename];
                                const source = asset.source();
                                const obfuscationResult = JavaScriptObfuscator.obfuscate(source, {
                                    compact: true,
                                    controlFlowFlattening: true,
                                    deadCodeInjection: true,
                                    debugProtection: false, // Pode causar problemas com source maps
                                    debugProtectionInterval: 0,
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
                                    sourceMapBaseUrl: '', // Mantido em branco para caminhos relativos
                                    sourceMapFileName: `${filename}.map`,
                                });

                                const obfuscatedCode = obfuscationResult.getObfuscatedCode();
                                const sourceMap = obfuscationResult.getSourceMap();

                                newAssets[filename] = {
                                    source: () => obfuscatedCode,
                                    size: () => obfuscatedCode.length,
                                };

                                if (sourceMap) {
                                    newAssets[`${filename}.map`] = {
                                        source: () => sourceMap,
                                        size: () => sourceMap.length,
                                    };
                                }
                            } else {
                                newAssets[filename] = compilation.assets[filename];
                            }
                        }
                        compilation.assets = newAssets;
                        callback();
                    });
                },
            },
            */
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