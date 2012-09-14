var OAuth2 = require('oauth').OAuth2,
    querystring = require('querystring'),
    request = require("request"),
    fs = require('fs'),
    FormData = require('form-data'),
    API_BASE_URL = 'https://api.weibo.com/',
    API_VERSION = '2';

//API_BASE_URL = 'http://127.0.0.1:8099/';

/**
 * SinaWeibo Client
 *
 * @param {string} AppKey
 * @param {string} AppSecret
 * @param {string} Optional, AccessToken if you have got one.
 */
var SinaWeibo = module.exports = function (clientId, clientSecret, accessToken) {
    this._clientId = clientId;
    this._clientSecret = clientSecret;
    this._accessToken = accessToken;
    this.oAuth = new OAuth2(clientId, clientSecret, API_BASE_URL, 'oauth2/authorize', 'oauth2/access_token');
};

SinaWeibo.prototype.getAuthorizeUrl = function (params) {
    return this.oAuth.getAuthorizeUrl(params);
};

/**
 * Get an Access Token from the server.
 * @param params
 * @param callback
 */
SinaWeibo.prototype.getAccessToken = function (params, callback) {
    var code = params.code;
    var self = this;
    this.oAuth.getOAuthAccessToken(code, params, function (err, accessToken, refreshToken, result) {
        if (err)return callback(new WeiboError(err));
        self._accessToken = accessToken;
        callback(null, result, accessToken, refreshToken);
    });
};

var WeiboError = SinaWeibo.WeiboError = function (message, statusCode) {
    this.name = "WeiboError";
    this.statusCode = statusCode || 500;

    if (message && message.constructor === Error) {
        this.message = message.message;
        Error.call(this, message);
        this.stack = message.stack;
        return;
    }

    if (message.constructor === Object) {
        this.statusCode = message.statusCode;
        this.data = JSON.parse(message.data);

        Error.call(this, this.data['error']);
        message = this.data['error'];
    }
    this.message = message;
    Error.call(this, message);
    Error.captureStackTrace(this, arguments.callee);
};

require('util').inherits(WeiboError, Error);

//WeiboError.prototype.toString = function () {
//    return this.message;
//};

function makeASinaWeiboResponseHandler(cb) {
    return function (err, data, response) {
        if (err) return cb(new WeiboError(err));

        var result;
        try {
            result = JSON.parse(data);
        } catch (e) {
            result = querystring.parse(data);
        }
        cb(null, result, response);
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
        var filePath = files[key];
        var isUrl = filePath.match(/^(?:(?:ht|f)tp(?:s?)\:\/\/|~\/|\/)?(?:\w+:\w+@)?(localhost|(?:(?:[-\w\d{1-3}]+\.)+(?:com|org|net|gov|mil|biz|info|mobi|name|aero|jobs|edu|co\.uk|ac\.uk|it|fr|tv|museum|asia|local|travel|[a-z]{2}))|((\b25[0-5]\b|\b[2][0-4][0-9]\b|\b[0-1]?[0-9]?[0-9]\b)(\.(\b25[0-5]\b|\b[2][0-4][0-9]\b|\b[0-1]?[0-9]?[0-9]\b)){3}))(?::[\d]{1,5})?(?:(?:(?:\/(?:[-\w~!$+|.,="'\(\)_\*]|%[a-f\d]{2})+)+|\/)+|\?|#)?(?:(?:\?(?:[-\w~!$+|.,*:]|%[a-f\d{2}])+=?(?:[-\w~!$+|.,*:=]|%[a-f\d]{2})*)(?:&(?:[-\w~!$+|.,*:]|%[a-f\d{2}])+=?(?:[-\w~!$+|.,*:=]|%[a-f\d]{2})*)*)*(?:#(?:[-\w~!$ |\/.,*:;=]|%[a-f\d]{2})*)?$/i) || filePath.length > 2083;// code from node validator

        if (isUrl) {
            var fileStream = request.get(filePath);
        } else {
            var fileStream = fs.createReadStream(filePath);
        }
        form.append(key, fileStream);
    });

    var responseHandler = makeASinaWeiboResponseHandler(cb);
    url = this._makeFullUrl(url);

    form.submit(url, function (err, response) {
        if (err)return cb(new WeiboError(err));

        var data = '';
        response.on("data", function (chunk) {
            data += chunk
        });

        response.on("close", function (err) {
            if (err)return cb(new WeiboError(err));
        });
        response.addListener("end", function () {
            responseHandler(null, data, response);
        });

    });
};


