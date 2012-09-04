var OAuth2 = require('oauth').OAuth2,
    querystring = require('querystring'),
    fs = require('fs'),
    FormData = require('form-data'),
    API_BASE_URL = 'https://api.weibo.com/',
    API_VERSION = '2';

//API_BASE_URL = 'http://127.0.0.1:8099/';

var SinaWeibo = module.exports = function (clientId, clientSecret, accessToken) {
    this._clientId = clientId;
    this._clientSecret = clientSecret;
    this._accessToken = accessToken;
    this.oAuth = new OAuth2(clientId, clientSecret, API_BASE_URL, 'oauth2/authorize', 'oauth2/access_token');
};

SinaWeibo.prototype.getAuthorizeUrl = function (params) {
    return this.oAuth.getAuthorizeUrl(params);
};

SinaWeibo.prototype.getAccessToken = function (params, callback) {
    var code = params.code;
    this.oAuth.getOAuthAccessToken(code, params, callback);
};

function makeASinaWeiboResponseHandler(cb) {
    return function (err, data, response) {
        if (err) return cb(err);

        var results;
        try {
            results = JSON.parse(data);
        } catch (e) {
            results = querystring.parse(data);
        }
        cb(null, response, results);
    };
}

SinaWeibo.prototype._makeHeaders = function (headers) {
    var defaults = {
        'User-Agent':'node-sina-weibo/0.0.1'
    };

    headers || (headers = {});

    Object.keys(defaults).forEach(function (key) {
        headers[key] || ( headers[key] = defaults[key]);
    });

    return headers;
};

SinaWeibo.prototype._makeFullUrl = function (url) {
    return API_BASE_URL + API_VERSION + '/' + url + '.json';
};

SinaWeibo.prototype.GET = function (url, params, cb) {
    var headers = this._makeHeaders();
    params || (params = {});
    var data = querystring.stringify(params);
    console.log('querystring:' + data);

    this.oAuth._request("GET", this._makeFullUrl(url) + '?' + data, headers, '', this._accessToken, makeASinaWeiboResponseHandler(cb));
};

SinaWeibo.prototype.POST = function (url, params, cb) {
    params || (params = {});
    params['access_token'] = this._accessToken;

    var data = querystring.stringify(params);
    var headers = this._makeHeaders({
        'Content-Type':'application/x-www-form-urlencoded'
    });

    this.oAuth._request("POST", this._makeFullUrl(url), headers, data, this._accessToken, makeASinaWeiboResponseHandler(cb));
};

//SinaWeibo.prototype._DELETE = function (url, params, cb) {
//
//}

SinaWeibo.prototype.UPLOAD = function (url, params, files, cb) {
    var form = new FormData();
    form.append('access_token', this._accessToken);

    Object.keys(params).forEach(function (key) {
        form.append(key, params[key]);
    });

    Object.keys(files).forEach(function (key) {
        form.append(key, fs.createReadStream(files[key]));
    });


    var responseHandler = makeASinaWeiboResponseHandler(cb);
    url = this._makeFullUrl(url);

    form.submit(url, function (err, response) {
        if (err)return cb(err);

        var data = '';
        response.on("data", function (chunk) {
            data += chunk
        });

        response.on("close", function (err) {
            if (err)return cb(err);
        });
        response.addListener("end", function () {
            responseHandler(null, data, response);
        });

    });
};


