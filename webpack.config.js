module.exports = {
    entry: ["babel-polyfill", "./scripts/app.js"],
    output: {
        filename: 'scripts/build.js'
    },
    module: {
        loaders: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
            query: {
                presets: ['es2015']
            }
        }]
    },
    devtool: 'source-map',
    watch: true,

    watchOptions: {
        aggregateTimeout: 150
    }
};
