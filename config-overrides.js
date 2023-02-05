const webpack=require('webpack');

module.exports=function override(config) {
    const fallback=config.resolve.fallback||{};
    Object.assign(fallback, {
        "fs": false,
        "tls": false,
        "net": false,
        "http": require.resolve("stream-http"),
        "https": false,
        "zlib": require.resolve("browserify-zlib"),
        "path": require.resolve("path-browserify"),
        "stream": require.resolve("stream-browserify"),
        "util": require.resolve("util/"),
        "crypto": require.resolve("crypto-browserify"),
        "stream": require.resolve("stream-browserify"),
        "assert": require.resolve("assert"),
        "os": require.resolve("os-browserify"),
        "url": require.resolve("url")
    })
    config.resolve.fallback=fallback;
    config.plugins=(config.plugins||[]).concat([
        new webpack.ProvidePlugin({
            process: 'process/browser',
            Buffer: ['buffer', 'Buffer']
        })
    ])
    config.ignoreWarnings=[/Failed to parse source map/];
    return config;
}
