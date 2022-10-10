const path = require('path');
const TerserPlugin = require("terser-webpack-plugin");
var package = require('./package.json');

module.exports = {
    entry: {
        vendor: Object.keys(package.dependencies),
        index: { dependOn: 'vendor', import: './src/index.ts' },
        diagram: { dependOn: 'vendor', import: './src/diagrams.ts' }
    },
    module: {
        rules: [
            {
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    devServer: {
        static: {
            directory: path.join(__dirname, 'dist'),
          },
        allowedHosts: ['.gitpod.io'],
        host: '0.0.0.0',
        compress: true,
        port: 8080,
        client: {
            progress: true,
        }
    },
    performance: { hints: false },
    mode: 'development',//'production',
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                extractComments: false,
            }),
        ],
        usedExports: true,
        moduleIds: 'named'
    },
    stats: {
        errorDetails: true
    }
};