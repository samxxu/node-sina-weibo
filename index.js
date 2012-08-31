var OAuth2 = require('oauth').OAuth2,
    querystring = require('querystring'),
    API_BASE_URL = 'https://api.weibo.com/';

var SinaWeibo = module.exports = function (clientId, clientSecret, accessToken) {
    this._clientId = clientId;
    this._clientSecret = clientSecret;
    this._accessToken = accessToken;
    this.oAuth = new OAuth2(clientId, clientSecret, API_BASE_URL, 'oauth2/authorize', 'oauth2/access_token');
};

SinaWeibo.prototype.getAuthorizeUrl = function (params) {
    return this.oAuth.getAuthorizeUrl(params);
};

SinaWeibo.prototype.getAccessToken = function (code, params, callback) {
    this.oAuth.getOAuthAccessToken(code, params, callback);
};


function makeASinaWeiboResponseHandler(cb) {
    var handler = function (err, data, response) {
        if (err) return cb(err);

        var results;
        try {
            results = JSON.parse(data);
        }
        catch (e) {
            results = querystring.parse(data);
        }
        cb(null, response, results);
    };

    return handler;
}

SinaWeibo.prototype._makeHeaders = function (headers) {
    var defaults = {
        'User-Agent':'node-sina-weibo/0.0.1'
    };

    headers = headers || {};
    for (var i in defaults) {
        if (!headers[i]) {
            headers[i] = defaults[i];
        }
    }

    return headers;
}

SinaWeibo.prototype._GET = function (url, params, cb) {
    var headers = this._makeHeaders();
    var data = querystring.stringify(params);
    console.log('querystring:' + data);

    this.oAuth._request("GET", url + '?' + data, headers, '', this._accessToken, makeASinaWeiboResponseHandler(cb));
};

SinaWeibo.prototype._POST = function (url, params, cb) {
    var params = params || {};
    params['access_token'] = this._accessToken;  // TODO test this

    var data = querystring.stringify(params);
    var headers = this._makeHeaders({
        'Content-Type':'application/x-www-form-urlencoded'
    });

    this._request("POST", url, headers, data, this._accessToken, makeASinaWeiboResponseHandler(cb));
}

SinaWeibo.prototype._DELETE = function (url, params, cb) {

}


SinaWeibo.resources = [
    {
        name:'statuses$public_timeline',
        url:'2/statuses/public_timeline.json',
        method:'GET'
    },
    {
        name:'users$show',
        url:'2/users/show.json',
        method:'GET'
    }
];

SinaWeibo.resources.forEach(function (resource) {
    SinaWeibo.prototype[resource.name] = function (params, cb) {
        params = params || {};
        this['_' + resource.method](API_BASE_URL + resource.url, params, cb);
    }
});
