const Proxy = require('json-caching-proxy');

var p = new Proxy({
    "remoteServerUrl": "https://a.tile.openstreetmap.org/",
    "proxyPort": 3001,
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