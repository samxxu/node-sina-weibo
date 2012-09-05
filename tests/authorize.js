var should = require('should'),
    util = require('util'),
    SinaWeibo = require('../lib');

describe("Class SinaWeibo", function () {

    before(function (done) {
        done();
    });

    after(function (done) {
        done();
    });

    var weibo = new SinaWeibo("1811757010", "6cedd7fc4aa38824f019d4c9aba6a151");

    describe('#getAuthorizeUrl()', function () {
        it('should return a valid authorize url', function (done) {
            var url = weibo.getAuthorizeUrl({
                redirect_uri:'http://runmyjs.com/callback',
                response_type:'code'
            });
            console.log('url : ' + url);
            url.length.should.be.above(10);
            done();
        });
    });

    describe('#getAccessToken()', function () {
        it('should return a valid AccessToken', function (done) {
            weibo.getAccessToken({
                    code:'77b0ac5b52a85fb898821a805ee6de2d',
                    grant_type:'authorization_code',
                    redirect_uri:'http://runmyjs.com/callback'
                }, function (err, results, accessToken) {
                    if (err) {
                        console.error(err);
                        return done(err);
                    }
                    console.log('accessToken:' + accessToken);
                    accessToken.length.should.be.above(10);
                    accessToken.should.equal(weibo._accessToken);
                    done();
                }
            );
        });
    });

    describe('#users/show', function () {
        it('should be able to call APIs', function (done) {
            weibo.GET('users/show', { uid:'1564554685' }, function (err, result, response) {
                if (err) {
                    console.error(err);
                    return done(err);
                }

                console.log(util.inspect(result));
                done();
            });
        });
    });

});
