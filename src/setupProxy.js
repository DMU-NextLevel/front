const {createProxyMiddleware} = require('http-proxy-middleware')

module.exports = function(app) {
    app.use(
        '/public', createProxyMiddleware({
            target: 'https://api.nextlevel.r-e.kr/',
            changeOrigin: true
        })
    )
    app.use(
        '/social',createProxyMiddleware({
            target:'https://api.nextlevel.r-e.kr/',
            changeOrigin: true
        })
    )
    app.use(
        '/api1', createProxyMiddleware({
            target:'https://api.nextlevel.r-e.kr/',
            changeOrigin: true
        })
    )
    app.use(
        '/payment', createProxyMiddleware({
            target:'https://api.nextlevel.r-e.kr/',
            changeOrigin: true
        })
    )
}