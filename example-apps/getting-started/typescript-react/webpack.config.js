const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const parts = require('../../../webpack.parts');

const PATHS = {
    app: path.join(__dirname, 'src'),
    build: path.join(__dirname, 'build'),
    reactComponents: path.join(__dirname, '../../../bb-public-library/react-components'),
    public: '/',
};

const common = merge([
    {
        entry: {
            app: PATHS.app,
        },
        output: {
            path: PATHS.build,
            filename: 'bundle.js',
            publicPath: PATHS.public,
            libraryTarget: 'umd',
        },
        resolve: {
            extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
            alias: {
                'bb-public-library/react-components': path.join(__dirname, '../../../bb-public-library/react-components/lib'),
                'bb-public-library/styles': path.join(__dirname, '../../../bb-public-library/styles'),
                'bb-public-library/utilities': path.join(__dirname, '../../../bb-public-library/utilities/lib'),
            },
        },
        plugins: [
            new webpack.NoEmitOnErrorsPlugin(),
        ],
    },
    parts.loadCSS(),
    parts.loadSASS(),
    parts.loadSvg(),
    parts.processReact([PATHS.app, PATHS.reactComponents], false),
    parts.processTypescript([PATHS.app], false),
    parts.generateSourcemaps('source-map'),
    parts.deDupe(),
]);

const buildDev = () => merge([
    common,
    parts.clean(PATHS.build, ['index.html']),
    {
        mode: 'development',
        plugins: [
            new webpack.WatchIgnorePlugin([
                path.join(__dirname, 'node_modules'),
            ]),
            new webpack.NamedModulesPlugin(),
            new HtmlWebpackPlugin({
                template: 'src/index.html',
                inject: false,
            }),
        ],
    },
    parts.devServer({
        disableHostCheck: true,
        host: process.env.HOST || 'localhost',
        port: process.env.PORT || 4321,
        publicPath: PATHS.public,
    }),
]);

const buildProd = () => merge([
    common,
    {
        mode: 'production',
        plugins: [
            new webpack.HashedModuleIdsPlugin(),
            new HtmlWebpackPlugin({
                template: 'src/index.html',
                inject: false,
            }),
        ],
    },
    parts.lintJavaScript({
        paths: PATHS.app,
        options: {
            emitWarning: true,
        },
    }),
    parts.setFreeVariable('process.env.NODE_ENV', 'production'),
    parts.minifyJavaScript({ useSourceMap: true }),
]);

const buildUmd = () => merge([
    buildProd(),
    parts.clean(PATHS.build),
    {
        output: {
            filename: 'bundle.js',
        },
    },
]);

module.exports = (env) => {
    process.env.BABEL_ENV = env;

    if (env === 'production') {
        return [buildUmd()];
    }

    return [buildDev()];
};
