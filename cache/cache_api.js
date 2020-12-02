const Proxy = require('json-caching-proxy');

var p = new Proxy({
    "remoteServerUrl": "https://api.covid19api.com/",
    "proxyPort": 3002,
    "cacheEverything": true,
    "showConsoleOutput": true,
    "dataPlayback": true,
    "dataRecord": true,
    "commandPrefix": "proxy",
    "proxyHeaderIdentifier": "proxy-cache-playback",
    "proxyTimeout": 500000,
    "deleteCookieDomain": true,
    "overrideCors": "localhost:8080",
    "useCorsCredentials": true
});

p.start();